"""
Rotas do carrinho de compras
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Cart, Product, User, Order, OrderItem, OrderStatus
from schemas import CartAdd, CartUpdate, CartItemResponse, CartResponse, MessageResponse
from utils.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Carrinho"])


@router.get("/{user_id}", response_model=CartResponse)
def get_cart(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Busca carrinho do usuário
    """
    # Verifica se o usuário está acessando o próprio carrinho
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para acessar este carrinho"
        )
    
    cart_items = db.query(Cart).filter(Cart.user_id == user_id).all()
    
    # Calcula o total
    total = sum(item.product.price * item.quantity for item in cart_items)
    
    return {
        "items": cart_items,
        "total": total
    }


@router.post("/add", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    cart_data: CartAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Adiciona produto ao carrinho
    """
    # Verifica se o produto existe
    product = db.query(Product).filter(Product.id == cart_data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    # Verifica se há estoque suficiente
    if product.stock < cart_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Estoque insuficiente. Disponível: {product.stock}"
        )
    
    # Verifica se o produto já está no carrinho
    existing_item = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == cart_data.product_id
    ).first()
    
    if existing_item:
        # Atualiza quantidade
        existing_item.quantity += cart_data.quantity
        message = "Quantidade atualizada no carrinho"
    else:
        # Adiciona novo item
        new_item = Cart(
            user_id=current_user.id,
            product_id=cart_data.product_id,
            quantity=cart_data.quantity
        )
        db.add(new_item)
        message = "Produto adicionado ao carrinho"
    
    db.commit()
    
    return {
        "message": message,
        "detail": f"{product.name} - Quantidade: {cart_data.quantity}"
    }


@router.put("/update/{item_id}", response_model=MessageResponse)
def update_cart_item(
    item_id: int,
    update_data: CartUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza quantidade de item no carrinho
    """
    cart_item = db.query(Cart).filter(
        Cart.id == item_id,
        Cart.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item não encontrado no carrinho"
        )
    
    # Verifica estoque
    if cart_item.product.stock < update_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Estoque insuficiente. Disponível: {cart_item.product.stock}"
        )
    
    cart_item.quantity = update_data.quantity
    db.commit()
    
    return {
        "message": "Quantidade atualizada",
        "detail": f"Nova quantidade: {update_data.quantity}"
    }


@router.delete("/remove/{item_id}", response_model=MessageResponse)
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Remove item do carrinho
    """
    cart_item = db.query(Cart).filter(
        Cart.id == item_id,
        Cart.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item não encontrado no carrinho"
        )
    
    product_name = cart_item.product.name
    db.delete(cart_item)
    db.commit()
    
    return {
        "message": "Item removido do carrinho",
        "detail": f"Produto: {product_name}"
    }


@router.post("/checkout", response_model=MessageResponse)
def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Finaliza compra convertendo carrinho em pedido
    """
    # Busca itens do carrinho
    cart_items = db.query(Cart).filter(Cart.user_id == current_user.id).all()
    
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Carrinho vazio"
        )
    
    # Valida estoque de todos os itens
    for item in cart_items:
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estoque insuficiente para {item.product.name}"
            )
    
    # Cria pedido
    total = sum(item.product.price * item.quantity for item in cart_items)
    new_order = Order(
        user_id=current_user.id,
        total=total,
        status=OrderStatus.PENDING
    )
    db.add(new_order)
    db.flush()  # Garante que o order.id esteja disponível
    
    # Cria itens do pedido e atualiza estoque
    for item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)
        
        # Atualiza estoque
        item.product.stock -= item.quantity
    
    # Limpa carrinho
    for item in cart_items:
        db.delete(item)
    
    db.commit()
    
    return {
        "message": "Pedido realizado com sucesso!",
        "detail": f"Pedido #{new_order.id} - Total: R$ {total:.2f}"
    }
