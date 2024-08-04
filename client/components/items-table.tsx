"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import { User } from "@nextui-org/user";
import { Edit3Icon, EyeIcon, Trash2 } from "lucide-react";
import { Chip } from "@nextui-org/chip";
import DeleteConfirmationModal from "@/components/delete-item-modal";
import ViewItemModal from "@/components/view-item-modal";
import EditItemModal from "@/components/edit-item-modal";
import { Item } from "@/types/item";

const columns = [
  { key: "name", name: "Name" },
  { key: "price", name: "Price" },
  { key: "status", name: "Status" },
  { key: "actions", name: "Actions" },
];

const statusColorMap: { [key: string]: "success" | "danger" | "warning" } = {
  sold: "success",
  removed: "danger",
  listed: "warning",
};

interface ItemsTableProps {
  items: [Item];
}

export default function ItemsTable({ items }: ItemsTableProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  //console.log("items table", items);

  const openDeleteModal = (itemId: string) => {
    setSelectedItemId(itemId);
    //console.log("selected item id", selectedItemId);
    setSelectedItem(items.find((item) => item._id === itemId));
    //console.log("selected item", selectedItem);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };

  const openViewModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedItem(items.find((item) => item._id === itemId));
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedItemId(null);
  };

  const openEditModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedItem(items.find((item) => item._id === itemId));
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
  };
  const renderCell = React.useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-semibold text-md">{item.title}</h1>
              <p className="font-extralight">{`${item.description.substring(0, 50)}...`}</p>
            </div>
          </div>
        );
      case "price":
        return (
          <p className="text-bold text-sm capitalize text-left">{item.price}</p>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.status ? item.status : "listed"]}
            size="sm"
            variant="flat"
          >
            {item.status ? item.status : "listed"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon onClick={() => openViewModal(item._id)} />
              </span>
            </Tooltip>
            <Tooltip content="Edit Ad">
              <span className="text-lg text-default-400 curstor-pointer active:opacity-50">
                <Edit3Icon onClick={() => openEditModal(item._id)} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Ad">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 onClick={() => openDeleteModal(item._id)} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey];
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
              align={column.key === "price" ? "center" : "start"}
              className="text-left"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell className="text-left">
                  {renderCell(item, String(columnKey))}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isModalOpen && selectedItemId && (
        <DeleteConfirmationModal
          item={selectedItem}
          onClose={closeDeleteModal}
        />
      )}
      {isViewModalOpen && selectedItemId && (
        <ViewItemModal item={selectedItem} onClose={closeViewModal} />
      )}
      {isEditModalOpen && selectedItemId && (
        <EditItemModal
          initialItem={selectedItem}
          itemId={selectedItem._id}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}
