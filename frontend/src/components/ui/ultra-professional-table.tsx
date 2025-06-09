import { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,

} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Settings,

  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  FileText,

  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface UltraProfessionalTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  title?: string;
  description?: string;
  searchKey?: string;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableExport?: boolean;
  enableColumnVisibility?: boolean;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  onAdd?: () => void;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onExport?: (format: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  showMetrics?: boolean;
  metrics?: {
    total: number;
    active: number;
    pending: number;
    completed: number;
  };
}

export function UltraProfessionalTable<TData>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = "Ara...",
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  enableColumnVisibility = true,
  enableRowSelection = false,
  enablePagination = true,
  pageSize = 10,
  onRowClick,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  onRefresh,
  loading = false,
  emptyMessage = "Veri bulunamadı",
  className = "",
  showMetrics = true,
  metrics
}: UltraProfessionalTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const selectedRowCount = Object.keys(rowSelection).length;
  const totalRows = table.getFilteredRowModel().rows.length;

  const defaultMetrics = useMemo(() => ({
    total: data.length,
    active: Math.floor(data.length * 0.7),
    pending: Math.floor(data.length * 0.2),
    completed: Math.floor(data.length * 0.1),
  }), [data.length]);

  const displayMetrics = metrics || defaultMetrics;

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (onExport) {
      onExport(format);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        {(title || description) && (
          <div>
            {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}

        {/* Metrics Cards */}
        {showMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam</p>
                    <p className="text-2xl font-bold">{displayMetrics.total.toLocaleString('tr-TR')}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aktif</p>
                    <p className="text-2xl font-bold text-green-600">{displayMetrics.active.toLocaleString('tr-TR')}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bekleyen</p>
                    <p className="text-2xl font-bold text-yellow-600">{displayMetrics.pending.toLocaleString('tr-TR')}</p>
                  </div>
                  <Minus className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tamamlanan</p>
                    <p className="text-2xl font-bold text-blue-600">{displayMetrics.completed.toLocaleString('tr-TR')}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {enableSearch && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {enableFilters && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtreler
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Sütun Filtreleri</h4>
                    {table.getAllColumns()
                      .filter((column) => column.getCanFilter())
                      .map((column) => (
                        <div key={column.id} className="space-y-2">
                          <label className="text-sm font-medium">
                            {column.id}
                          </label>
                          <Input
                            placeholder={`${column.id} filtrele...`}
                            value={(column.getFilterValue() as string) ?? ""}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                          />
                        </div>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Sütunlar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        className="flex items-center space-x-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Checkbox
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        />
                        <span>{column.id}</span>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Yenile
              </Button>
            )}

            {enableExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Dışa Aktar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    CSV olarak indir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    Excel olarak indir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    PDF olarak indir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {onAdd && (
              <Button size="sm" onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Ekle
              </Button>
            )}
          </div>
        </div>

        {/* Selection Info */}
        {enableRowSelection && selectedRowCount > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedRowCount} / {totalRows} satır seçildi
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setRowSelection({})}>
                Seçimi Temizle
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Seçilenleri Sil
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted/50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center space-x-2 ${
                              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                            {header.column.getIsSorted() === 'desc' && (
                              <ChevronDown className="ml-2 h-4 w-4" />
                            )}
                            {header.column.getIsSorted() === 'asc' && (
                              <ChevronUp className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                    {(onEdit || onDelete) && (
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        İşlemler
                      </th>
                    )}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b transition-colors hover:bg-muted/50 ${
                        onRowClick ? 'cursor-pointer' : ''
                      } ${row.getIsSelected() ? 'bg-muted' : ''}`}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="p-4 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Düzenle
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem 
                                  onClick={() => onDelete(row.original)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Sil
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Yükleniyor...</span>
                        </div>
                      ) : (
                        emptyMessage
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} 
              ({totalRows} toplam kayıt)
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
