from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import uuid
from . import repository, models, schemas

async def get_user_support_tickets_service(db: AsyncSession, user_id: str, limit: int = 20, offset: int = 0):
    tickets = await repository.get_user_support_tickets(db, user_id, limit, offset)
    total = await repository.count_user_support_tickets(db, user_id)
    return schemas.SupportTicketListResponse(
        items=tickets,
        total=total,
        limit=limit,
        offset=offset
    )

async def get_support_ticket_service(db: AsyncSession, ticket_id: str, user_id: str):
    try:
        t_uuid = uuid.UUID(ticket_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ticket ID format")
        
    ticket = await repository.get_support_ticket_by_id(db, t_uuid)
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")
        
    # Later admins might view any ticket, but for now only owner
    if ticket.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this ticket")
        
    return ticket

async def create_support_ticket_service(db: AsyncSession, ticket_in: schemas.SupportTicketCreate, user_id: str):
    new_ticket = models.SupportTicket(
        user_id=user_id,
        subject=ticket_in.subject,
        description=ticket_in.description,
        category=ticket_in.category,
        priority=ticket_in.priority,
        attachment_url=ticket_in.attachment_url,
        status="open"
    )
    return await repository.create_support_ticket(db, new_ticket)
