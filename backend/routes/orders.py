"""
Rotas de pedidos
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Order, OrderItem, Product, User
from schemas import OrderCreate, OrderResponse, OrderStatusUpdate, MessageResponse
from utils.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/orders", tags=["Pedidos"])


@router.get("", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Lista todos os pedidos (apenas admin)
    """
    orders = db.query(Order).all()
    return orders


@router.get("/user/{user_id}", response_model=List[OrderResponse])
def get_user_orders(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista pedidos de um usuário específico
    """
    # Verifica se o usuário está acessando os próprios pedidos
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para acessar estes pedidos"
        )
    
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return orders


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo pedido
    """
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O pedido deve conter pelo menos um item"
        )
    
    # Valida todos os produtos e estoque
    total = 0
    validated_items = []
    
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produto com ID {item.product_id} não encontrado"
            )
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estoque insuficiente para {product.name}. Disponível: {product.stock}"
            )
        
        validated_items.append({
            "product": product,
            "quantity": item.quantity,
            "price": product.price
        })
        total += product.price * item.quantity
    
    # Cria o pedido
    new_order = Order(
        user_id=current_user.id,
        total=total
    )
    db.add(new_order)
    db.flush()  # Garante que o order.id esteja disponível
    
    # Cria os itens do pedido e atualiza estoque
    for item_data in validated_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            price=item_data["price"]
        )
        db.add(order_item)
        
        # Atualiza estoque
        item_data["product"].stock -= item_data["quantity"]
    
    db.commit()
    db.refresh(new_order)
    
    return new_order


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Atualiza status de um pedido (apenas admin)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pedido com ID {order_id} não encontrado"
        )
    
    order.status = status_data.status
    db.commit()
    db.refresh(order)
    
    return order
