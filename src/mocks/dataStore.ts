// mocks/dataStore.ts - 仿真数据库层
import type { User, DbStats, CustomerData, RoomData } from '@/types/types';
import type { BuildingData, EnergyType } from '@/types/types';
import { users, customerData, echartsData, buildingData, getRoomData } from './data';
import type { ContractData } from '@/types/types';
import { contractData } from '@/pages/finance/contract_data';

// 生成Id前缀
const now = new Date();

const dateStr =
  now.getFullYear() +
  String(now.getMonth() + 1).padStart(2, '0') +
  String(now.getDate()).padStart(2, '0') +
  String(now.getHours()).padStart(2, '0') +
  String(now.getMinutes()).padStart(2, '0') +
  String(now.getSeconds()).padStart(2, '0');

// 仿真数据库类
export class SimulatedDatabase<T extends { id: string }> {
  private records: Map<string, T>;
  private nextId: number;
  private idPrefix: string;

  constructor(
    initialData: Array<Omit<T, 'id'>> = [],
    options: { idPrefix?: string; startId?: number } = {}
  ) {
    this.records = new Map();
    this.nextId = options.startId ?? 1;
    this.idPrefix = options.idPrefix ?? dateStr;

    initialData.forEach((item) => {
      const id = this.generateId();
      this.records.set(id, { ...item, id } as T);
    });
  }

  private generateId(): string {
    return `${this.idPrefix}${this.nextId++}`;
  }

  getAll(): T[] {
    return Array.from(this.records.values());
  }

  getById(id: string | number): T | null {
    return this.records.get(String(id)) ?? null;
  }

  // 根据指定字段值获取记录
  getByField<K extends keyof T>(field: K, value: T[K]): T | null {
    for (const record of this.records.values()) {
      if (record[field] === value) {
        return record;
      }
    }
    return null;
  }

  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const id = this.generateId();
    const now = new Date().toISOString();

    const newRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    } as unknown as T;

    this.records.set(id, newRecord);
    return newRecord;
  }

  update(id: string | number, data: Partial<Omit<T, 'id'>>): T | null {
    const key = String(id);
    const existing = this.records.get(key);

    if (!existing) return null;

    const updated = {
      ...existing,
      ...data,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    } as T;

    this.records.set(key, updated);
    return updated;
  }

  delete(id: string | number): (T & { deletedAt: string }) | null {
    const key = String(id);
    const record = this.records.get(key);

    if (!record) return null;

    this.records.delete(key);

    return {
      ...record,
      deletedAt: new Date().toISOString(),
    } as T & { deletedAt: string };
  }

  deleteMany(ids: Array<string | number>): Array<T & { deletedAt: string }> {
    const results: Array<T & { deletedAt: string }> = [];

    ids.forEach((id) => {
      const deleted = this.delete(id);
      if (deleted) results.push(deleted);
    });

    return results;
  }

  getStats(): DbStats {
    return {
      total: this.records.size,
      ids: Array.from(this.records.keys()),
    };
  }

  reset(initialData: Array<Omit<T, 'id'>> = []): void {
    this.records.clear();
    this.nextId = 1;
    initialData.forEach((item) => {
      const id = this.generateId();
      this.records.set(id, { ...item, id } as T);
    });
  }

  // 调试用：直接操作内部状态
  __unsafe_getRecords(): Map<string, T> {
    return this.records;
  }
}

// 用户专用数据库实例
const initialUsers: Array<Omit<User, 'id'>> = users; // 初始用户数据
export const userDb = new SimulatedDatabase<User>(initialUsers);

// 客户专用数据库实例
const initialCustomers: Array<Omit<CustomerData, 'id'>> = customerData;
export const customerDb = new SimulatedDatabase<CustomerData>(initialCustomers);

// 初始化能源数据
const initialEnergy: Array<Omit<EnergyType, 'id'>> = echartsData;
export const energyDb = new SimulatedDatabase<EnergyType>(initialEnergy);

// 初始化楼宇数据
const initialBuilding: Array<Omit<BuildingData, 'id'>> = buildingData;
export const buildingDb = new SimulatedDatabase<BuildingData>(initialBuilding);

// 初始化合同数据
const initialContract: Array<Omit<ContractData, 'id'>> = contractData;
export const contractDb = new SimulatedDatabase<ContractData>(initialContract);

// 获取房间数据的函数
export const getRoomlist = (buildingId: string) => {
  const initialRoomData: Array<Omit<RoomData, 'id'>> = getRoomData(buildingId);
  const roomDb = new SimulatedDatabase<RoomData>(initialRoomData);
  return roomDb; };
