'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { User } from '@nextui-org/user';
import { Edit3Icon, EyeIcon, Trash2 } from 'lucide-react';
import { Chip } from '@nextui-org/chip';
import DeleteConfirmationModal from '@/components/delete-item-modal';
import ViewItemModal from '@/components/view-item-modal';
import EditItemModal from '@/components/edit-item-modal';

const columns = [
  { key: 'name', name: 'Name' },
  { key: 'price', name: 'Price' },
  { key: 'status', name: 'Status' },
  { key: 'actions', name: 'Actions' },
];

const products = [
  {
    id: 1,
    title: 'Used MacBook Pro',
    description:
      'Used MacBook Pro 2019 13-inch Used MacBook Pro 2019 13-inch Used MacBook Pro 2019 13-inch Used MacBook Pro 2019 13-inch',
    price: '1200',
    status: 'listed',
    image: 'https://example.com/images/macbook-pro.jpg',
  },
  {
    id: 2,
    title: 'Mountain Bike',
    description: 'Mountain Bike 29-inch',
    price: '350',
    status: 'sold',
    image: 'https://example.com/images/mountain-bike.jpg',
  },
  {
    id: 3,
    title: 'Stationery Set',
    description: 'Stationery Set for school',
    price: '15',
    status: 'removed',
    image: 'https://example.com/images/stationery.jpg',
  },
  // Add more products as needed
];

const statusColorMap = {
  sold: 'success',
  removed: 'danger',
  listed: 'warning',
};

export default function ItemsTable() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const openDeleteModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };

  const openViewModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedItemId(null);
  };

  const openEditModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
  };
  const renderCell = React.useCallback((product: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-semibold text-md">{product.title}</h1>
              <p className="font-extralight">{`${product.description.substring(0, 50)}...`}</p>
            </div>
          </div>
        );
      case 'price':
        return (
          <p className="text-bold text-sm capitalize text-left">
            {product.price}
          </p>
        );
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[product.status]}
            size="sm"
            variant="flat"
          >
            {product.status}
          </Chip>
        );
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon onClick={() => openViewModal(product.id)} />
              </span>
            </Tooltip>
            <Tooltip content="Edit Ad">
              <span className="text-lg text-default-400 curstor-pointer active:opacity-50">
                <Edit3Icon onClick={() => openEditModal(product.id)} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Ad">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 onClick={() => openDeleteModal(product.id)} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return product[columnKey];
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <Table
        aria-label="Product table with custom cells"
        className="min-w-full"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === 'price' ? 'center' : 'start'}
              className="text-left"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={products}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="text-left">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isModalOpen && selectedItemId && (
        <DeleteConfirmationModal
          itemid={selectedItemId}
          onClose={closeDeleteModal}
        />
      )}
      {isViewModalOpen && selectedItemId && (
        <ViewItemModal itemid={selectedItemId} onClose={closeViewModal} />
      )}
      {isEditModalOpen && selectedItemId && (
        <EditItemModal itemid={selectedItemId} onClose={closeEditModal} />
      )}
    </div>
  );
}
