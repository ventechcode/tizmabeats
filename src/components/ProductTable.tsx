"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
} from "@heroui/react"
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon, EditIcon, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "./ui/dialog"

type Product = {
  id: string
  createdAt: Date
  name: string
  purchased: boolean
  producer: {
    username: string
  }
  licenses: {
    id: string
    price: number
    licenseOption: {
      name: string
    }
  }[]
}

const columns: any[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "PRODUCER", uid: "producer", sortable: true },
  { name: "LICENSES", uid: "licenses" },
  { name: "PURCHASED", uid: "purchased", sortable: true },
  { name: "ACTIONS", uid: "actions" },
]

const INITIAL_VISIBLE_COLUMNS = ["name", "createdAt", "producer", "licenses", "purchased", "actions"]

export default function ProductTable({ products }: { products: Product[] }) {
  const [filterValue, setFilterValue] = useState("")
  const [selectedKey, setSelectedKey] = useState<string>("")
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS))
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  })
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenRows, setIsOpenRows] = useState(false)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredProducts = [...products]

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(filterValue.toLowerCase()),
      )
    }

    return filteredProducts
  }, [hasSearchFilter, filterValue, products])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Product, b: Product) => {
      const first = a[sortDescriptor.column as keyof Product]
      const second = b[sortDescriptor.column as keyof Product]
      const cmp = first < second ? -1 : first > second ? 1 : 0
      return sortDescriptor.direction === "descending" ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const formatDate = (dateString: string, locale = "en-US") => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderCell = React.useCallback(
    (product: Product, columnKey: React.Key): React.ReactNode => {
      switch (columnKey) {
        case "id":
          return product.id
        case "createdAt":
          return formatDate(product.createdAt.toString(), "en-US")
        case "name":
          return product.name
        case "producer":
          return product.producer.username
        case "licenses":
          return (
            <div>
              {product.licenses
                .sort((a, b) => a.price - b.price)
                .map((license) => (
                  <div key={license.id}>
                    {license.licenseOption.name} - {license.price}€
                  </div>
                ))}
            </div>
          )
        case "purchased":
          return product.purchased ? "Yes" : "No"
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
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this product?</DialogDescription>
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
          )
        default:
          return null
      }
    },
    [showDeleteDialog],
  )

  const onSelectionChange = (keys: Selection) => {
    setSelectedKey(keys.toString())
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col sm:flex-row sm:justify-end items-start sm:items-center gap-4 mt-4 md:mt-0 w-full">
        <Input
          isClearable
          className="w-full mt-2 sm:max-w-[44%] bg-crust rounded-lg"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <div className="flex items-center justify-end gap-2 md:gap-2 w-full">
          <Dropdown onOpenChange={setIsOpen}>
            <DropdownTrigger className="flex w-full sm:ml-0 sm:w-max mt-2">
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
            <DropdownTrigger className="flex w-full ml-2 sm:ml-0 sm:w-max mt-2">
              <Button
                className="bg-crust text-text rounded-lg"
                endContent={isOpenRows ? <ChevronUpIcon /> : <ChevronDownIcon />}
                variant="flat"
              >
                {rowsPerPage} Rows
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Rows per page"
              closeOnSelect={false}
              selectionMode="single"
              selectedKeys={[rowsPerPage.toString()]}
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).map(Number)[0]
                if (selectedValue) setRowsPerPage(selectedValue);
                else setRowsPerPage(5);
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
          <Button
            className="bg-text text-crust rounded-lg hover:text-text hover:bg-crust duration-300 w-full ml-2 sm:w-auto mt-2"
            variant="flat"
            onPress={() => router.push("/dashboard/products/new")}
          >
            <div className="flex items-center justify-center gap-x-2 font-semibold">
              <Plus className="" />
              <p className="hidden lg:block font-semibold">New Product</p>
            </div>
          </Button>
        </div>
      </div>
    )
  }, [filterValue, visibleColumns, isOpen, isOpenRows, rowsPerPage])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-row sm:flex-row justify-between items-center gap-4">
        <span className="w-[30%] text-small text-default-400">
          {/* {selectedKey
            ? `${filteredItems.find((item: Product) => item.id == selectedKey)?.name} selected`
            : `${filteredItems.length} products`} */}
            {`${filteredItems.length} products`}
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
    )
  }, [selectedKey, filteredItems.length, page, pages])

  return (
    <Table
      aria-label="Product table"
      isHeaderSticky
      bottomContent={bottomContent}
      classNames={{
        th: "bg-crust text-text",
        tr: "bg-surface0",
        table: "rounded-lg overflow-x-auto",
        base: "rounded-lg sm:mt-8",
        wrapper: "rounded-lg",
        td: "w-[20%] ",
      }}
      selectedKeys={selectedKey}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      bottomContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            onMouseEnter={() => column.sortable && setHoveredColumn(column.uid)}
            onMouseLeave={() => setHoveredColumn(null)}
            
            className={column.sortable ? "hover:cursor-pointer hover:text-subtext0 w-12" : ""}
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
              <TableCell className="truncate" key={columnKey}>
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

