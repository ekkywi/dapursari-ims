/**
 * Modul 2 — Manajemen Gudang API contracts (JSON shapes as returned by the API).
 *
 * Decimal fields (stock, quantity) are serialized as strings to keep precision,
 * e.g. "14.75" — use Number(value) before doing arithmetic.
 * Date fields are ISO 8601 strings.
 */

export type DecimalString = string;
export type ISODateString = string;

export interface NamedRef {
  id: string;
  name: string;
}

// --- Supplier ---------------------------------------------------------------

export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateSupplierRequest {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export type UpdateSupplierRequest = Partial<CreateSupplierRequest>;

// --- Category & Unit --------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Unit {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateUnitRequest {
  name: string;
}

// --- Item (barang) ----------------------------------------------------------

export interface Item {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  unitId: string;
  minStock: DecimalString;
  warehouseStock: DecimalString;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  category: NamedRef;
  unit: NamedRef;
}

export interface CreateItemRequest {
  code: string;
  name: string;
  categoryId: string;
  unitId: string;
  minStock?: number;
}

export type UpdateItemRequest = Partial<CreateItemRequest>;

// --- Stok masuk -------------------------------------------------------------

export interface StockIn {
  id: string;
  supplierId: string;
  itemId: string;
  quantity: DecimalString;
  date: ISODateString;
  note: string | null;
  createdById: string;
  createdAt: ISODateString;
  supplier: NamedRef;
  item: { id: string; code: string; name: string; unit: NamedRef };
  createdBy: NamedRef;
}

export interface CreateStockInRequest {
  supplierId: string;
  itemId: string;
  quantity: number;
  /** e.g. "2026-10-06" */
  date: string;
  note?: string;
}

export interface StockInQuery {
  supplierId?: string;
  itemId?: string;
  startDate?: string;
  /** Inclusive; a date-only value covers the whole day. */
  endDate?: string;
}

// --- Stok gudang ------------------------------------------------------------

export interface WarehouseStock {
  id: string;
  code: string;
  name: string;
  minStock: DecimalString;
  warehouseStock: DecimalString;
  isActive: boolean;
  updatedAt: ISODateString;
  category: NamedRef;
  unit: NamedRef;
  /** true when warehouseStock <= minStock */
  isBelowMinimum: boolean;
}

export interface WarehouseStockDetail extends WarehouseStock {
  /** Latest 20 stock-in transactions, newest first. */
  recentStockIns: {
    id: string;
    quantity: DecimalString;
    date: ISODateString;
    note: string | null;
    createdAt: ISODateString;
    supplier: NamedRef;
    createdBy: NamedRef;
  }[];
}

export interface WarehouseStockQuery {
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
  /** Defaults to true. */
  isActive?: boolean;
}
