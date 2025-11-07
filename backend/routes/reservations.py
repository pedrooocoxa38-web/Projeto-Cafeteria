"""
Rotas de reservas
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db
from models import Reservation, User, ReservationStatus
from schemas import ReservationCreate, ReservationUpdate, ReservationResponse, MessageResponse
from utils.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/reservations", tags=["Reservas"])


@router.get("", response_model=List[ReservationResponse])
def get_all_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Lista todas as reservas (apenas admin)
    """
    reservations = db.query(Reservation).all()
    return reservations


@router.get("/user/{user_id}", response_model=List[ReservationResponse])
def get_user_reservations(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista reservas de um usuário específico
    """
    # Verifica se o usuário está acessando as próprias reservas
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para acessar estas reservas"
        )
    
    reservations = db.query(Reservation).filter(Reservation.user_id == user_id).all()
    return reservations


@router.post("", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
def create_reservation(
    reservation_data: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria uma nova reserva
    """
    # Validação básica de data (formato YYYY-MM-DD)
    try:
        reservation_date = datetime.strptime(reservation_data.date, "%Y-%m-%d")
        if reservation_date.date() < datetime.now().date():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Não é possível fazer reserva em data passada"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de data inválido. Use: YYYY-MM-DD"
        )
    
    # Validação básica de horário (formato HH:MM)
    try:
        datetime.strptime(reservation_data.time, "%H:%M")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de horário inválido. Use: HH:MM"
        )
    
    # Verifica se já existe reserva no mesmo horário e data
    existing_reservation = db.query(Reservation).filter(
        Reservation.date == reservation_data.date,
        Reservation.time == reservation_data.time,
        Reservation.status != ReservationStatus.CANCELLED
    ).first()
    
    if existing_reservation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe uma reserva para este horário"
        )
    
    # Cria nova reserva
    new_reservation = Reservation(
        user_id=current_user.id,
        date=reservation_data.date,
        time=reservation_data.time,
        people_count=reservation_data.people_count,
        status=ReservationStatus.PENDING
    )
    
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    
    return new_reservation


@router.put("/{reservation_id}", response_model=ReservationResponse)
def update_reservation(
    reservation_id: int,
    reservation_data: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza uma reserva existente
    """
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva não encontrada"
        )
    
    # Verifica permissão
    if reservation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para editar esta reserva"
        )
    
    # Atualiza apenas os campos fornecidos
    update_data = reservation_data.model_dump(exclude_unset=True)
    
    # Validações se data ou hora forem atualizadas
    if "date" in update_data:
        try:
            reservation_date = datetime.strptime(update_data["date"], "%Y-%m-%d")
            if reservation_date.date() < datetime.now().date():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Não é possível fazer reserva em data passada"
                )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de data inválido. Use: YYYY-MM-DD"
            )
    
    if "time" in update_data:
        try:
            datetime.strptime(update_data["time"], "%H:%M")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de horário inválido. Use: HH:MM"
            )
    
    for key, value in update_data.items():
        setattr(reservation, key, value)
    
    db.commit()
    db.refresh(reservation)
    
    return reservation


@router.delete("/{reservation_id}", response_model=MessageResponse)
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cancela uma reserva
    """
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva não encontrada"
        )
    
    # Verifica permissão
    if reservation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para cancelar esta reserva"
        )
    
    # Marca como cancelada ao invés de deletar
    reservation.status = ReservationStatus.CANCELLED
    db.commit()
    
    return {
        "message": "Reserva cancelada com sucesso",
        "detail": f"Reserva #{reservation_id} para {reservation.date} às {reservation.time}"
    }
