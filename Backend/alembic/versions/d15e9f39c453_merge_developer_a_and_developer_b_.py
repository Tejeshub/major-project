"""Merge Developer A and Developer B migration branches

Revision ID: d15e9f39c453
Revises: dea3df99c106, a1b2c3d4e5f6
Create Date: 2026-07-18 00:24:24.552038

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd15e9f39c453'
down_revision: Union[str, Sequence[str], None] = ('dea3df99c106', 'a1b2c3d4e5f6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
