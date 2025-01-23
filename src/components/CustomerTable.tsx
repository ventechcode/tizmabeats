"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  type Selection,
  type SortDescriptor,
  Chip,
} from "@heroui/react";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  EditIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "./ui/dialog";

type Customer = {
  id: string;
  createdAt: Date;
  email: string;
  name: string;
  address: string;
  orders: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    price: number;
    userId: string;
  }[];
};

const columns: any[] = [
  { name: "CUSTOMER ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "COUNTRY", uid: "address", sortable: true },
  { name: "ORDERS", uid: "orders" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "createdAt",
  "name",
  "email",
  "address",
  "orders",
];

export default function CustomerTable({
  customers,
}: {
  customers: Customer[];
}) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRows, setIsOpenRows] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredCustomers = [...customers];

    if (hasSearchFilter) {
      filteredCustomers = filteredCustomers.filter((customer) =>
        customer.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCustomers;
  }, [hasSearchFilter, filterValue, customers]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Customer, b: Customer) => {
      const first = a[sortDescriptor.column as keyof Customer];
      const second = b[sortDescriptor.column as keyof Customer];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const formatDate = (dateString: string, locale: string = "en-US") => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderCell = React.useCallback(
    (customer: Customer, columnKey: React.Key): React.ReactNode => {
      switch (columnKey) {
        case "id":
          return customer.id;
        case "createdAt":
          return formatDate(customer.createdAt.toString(), "de-DE");
        case "name":
          return customer.name;
        case "email":
          return customer.email;
        case "address":
          return JSON.parse(customer.address).country;
        case "orders":
          return (
            <div className="flex flex-col gap-2">
              {customer.orders.map((order) => (
                <Dialog>
                  <DialogTrigger>
                    <div className="border-2 rounded-full bg-transparent border-subtext2 text-subtext2 hover:border-subtext0 hover:text-subtext0 duration-300">
                      <p className="text-xs py-1">
                        {formatDate(order.createdAt.toString()).split("at")[0]}
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="bg-base border-none">
                    <DialogTitle className="flex items-center gap-x-2"><p className="font-semibold">Order:</p> <p className="text-subtext0">#{order.id}</p></DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex gap-x-2">
                          <p className="font-semibold">Total:</p> {order.price}€
                        </div>
                        <div className="flex gap-x-2">
                          <p className="font-semibold">Date:</p>{" "}
                          {
                            formatDate(order.createdAt.toString()).split(
                              "at"
                            )[0]
                          }
                        </div>
                        <div className="flex gap-x-2">
                          <p className="font-semibold">Customer:</p> {customer.name}
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          );
        case "actions":
          return (
            <div className="flex justify-center items-center gap-2">
              <Button isIconOnly radius="full" size="sm" variant="light">
                <EditIcon />
              </Button>
              <Dialog onOpenChange={setShowDeleteDialog}>
                <DialogTrigger>
                  <TrashIcon className="hover:text-red duration-300 hover:scale-125" />
                </DialogTrigger>
                <DialogClose />
                <DialogContent className="bg-crust rounded-lg border-none">
                  <DialogHeader>
                    <DialogTitle>Delete Customer</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this Customer?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end items-center gap-x-8 mt-2">
                    <DialogTrigger>
                      <button className="border-none focus:outline-none focus:border-collapse">
                        <p>Cancel</p>
                      </button>
                    </DialogTrigger>
                    <DialogTrigger>
                      <button className="flex items-center gap-1 border-2 border-red text-red bg-transparent rounded-lg hover:text-red/70 hover:border-red/70  duration-300 p-2">
                        <TrashIcon />
                        <p>Delete</p>
                      </button>
                    </DialogTrigger>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        default:
          return null;
      }
    },
    [showDeleteDialog]
  );

  const onSelectionChange = (keys: Selection) => {
    setSelectedKey(keys.toString());
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%] bg-crust rounded-lg"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <div className="flex flex-row gap-2">
          <Dropdown onOpenChange={setIsOpen}>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                className="bg-crust text-text rounded-lg"
                endContent={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
              className="bg-crust rounded-lg"
              classNames={{
                base: "w-48",
                list: "space-y-1",
              }}
            >
              {columns.map((column) => (
                <DropdownItem
                  key={column.uid}
                  classNames={{
                    base: "rounded-lg hover:bg-text hover:text-crust",
                  }}
                >
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown onOpenChange={setIsOpenRows}>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                className="bg-crust text-text rounded-lg"
                endContent={
                  isOpenRows ? <ChevronUpIcon /> : <ChevronDownIcon />
                }
                variant="flat"
              >
                # Rows
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Rows per page"
              closeOnSelect={false}
              selectionMode="single"
              selectedKeys={[rowsPerPage.toString()]}
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).map(Number)[0];
                setRowsPerPage(selectedValue);
              }}
              className="bg-crust rounded-lg"
              classNames={{
                base: "w-48",
                list: "space-y-1",
              }}
            >
              <DropdownItem
                key={"5"}
                classNames={{
                  base: "rounded-lg hover:bg-text hover:text-crust",
                }}
              >
                5
              </DropdownItem>
              <DropdownItem
                key={"10"}
                classNames={{
                  base: "rounded-lg hover:bg-text hover:text-crust",
                }}
              >
                10
              </DropdownItem>
              <DropdownItem
                key={"15"}
                classNames={{
                  base: "rounded-lg hover:bg-text hover:text-crust",
                }}
              >
                15
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, isOpen, isOpenRows, rowsPerPage]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKey
            ? `${
                filteredItems.find((item: Customer) => item.id == selectedKey)
                  ?.name
              } selected`
            : `${filteredItems.length} customers`}
        </span>
        <Pagination
          unselectable="on"
          page={page}
          total={pages}
          onChange={setPage}
          showControls
          isCompact
          classNames={{
            base: "bg-crust text-text rounded-lg",
            wrapper: "rounded-lg bg-transparent",
            item: "hover:bg-text hover:text-crust rounded-lg duration-300 data-[active=true]:bg-text data-[active=true]:text-crust",
            chevronNext: "rotate-180",
          }}
        />
      </div>
    );
  }, [selectedKey, filteredItems.length, page, pages]);

  const deleteDialog = React.useMemo(() => {}, [showDeleteDialog]);

  const isRowSelected = (id: string) => {
    return selectedKey === id;
  };

  return (
    <Table
      removeWrapper
      aria-label="Customer table"
      isHeaderSticky
      bottomContent={bottomContent}
      classNames={{
        wrapper: "max-h-[382px]",
        th: "bg-crust text-text",
        tr: "bg-surface0",
        table: "rounded-lg",
        base: "rounded-lg",
      }}
      selectedKeys={selectedKey}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={onSelectionChange}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" || column.uid === "orders" ? "center" : "start"}
            allowsSorting={column.sortable}
            onMouseEnter={() => column.sortable && setHoveredColumn(column.uid)}
            onMouseLeave={() => setHoveredColumn(null)}
            className={
              column.sortable ? "hover:cursor-pointer hover:text-subtext0" : ""
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow
            key={item.id}
            onClick={() => setSelectedKey(item.id)}
            // className={`hover:bg-surface2 transition-colors ${
            //   item.id === selectedKey ? "border-2 border-blue-500" : ""
            // }`}
            className="odd:bg-surface0 even:bg-surface1"
          >
            {(columnKey) => (
              <TableCell
                className="truncate max-w-12 sm:max-w-72"
                key={columnKey}
              >
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
