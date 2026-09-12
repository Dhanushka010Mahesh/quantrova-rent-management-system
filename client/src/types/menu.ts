export interface MenuItem {
  id: string;
  label: string;
  path?: string;        // route path - leaf item එකක් නම් (Link/NavLink)
  icon?: React.ReactNode; // optional icon (svg / emoji)
  children?: MenuItem[]; // max ~5 per level (recommended)
}

export interface TableCellProps {
  children: React.ReactNode;
  className?: string; // className optional prop එකක් ලෙස එකතු කිරීම
}

export interface TdProps {
  children: React.ReactNode;
  className?: string;
}