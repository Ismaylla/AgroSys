import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { ActionButtons } from "@/components/ui/ActionButtons";
import {
  FaPlus,
  FaEye,
  FaDownload,
  FaTrash,
  FaFileInvoice,
} from "react-icons/fa";
import { useInvoice } from "@/hooks/useInvoice";

function NotasFiscaisPage() {
  const navigate = useNavigate();
  const { invoices, loading, error, fetchInvoices } = useInvoice();

  // Transform invoices data to match the table structure
  const notasFiscaisData = invoices.map((invoice) => ({
    numero: invoice.invoiceNumber,
    tipo:
      invoice.type === "SAIDA"
        ? "NF-e"
        : invoice.type === "ENTRADA"
        ? "NF-e Entrada"
        : "NF-e Transferência",
    destino: invoice.customer || invoice.supplier || "N/A",
    valorTotal: `R$ ${invoice.finalAmount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`,
    data: new Date(invoice.issueDate).toLocaleDateString("pt-BR"),
    status: invoice.status,
    produtos: invoice.items
      .map((item) => `${item.productName} - ${item.quantity} ${item.unit}`)
      .join(", "),
  }));

  const columns = [
    { key: "numero", label: "Nº NOTA" },
    { key: "tipo", label: "TIPO" },
    { key: "destino", label: "DESTINO" },
    { key: "valorTotal", label: "VALOR TOTAL" },
    { key: "data", label: "DATA" },
    { key: "status", label: "STATUS" },
  ];

  const filters = [
    {
      key: "tipo",
      label: "Tipo",
      options: [
        { value: "SAIDA", label: "NF-e Saída" },
        { value: "ENTRADA", label: "NF-e Entrada" },
        { value: "TRANSFERENCIA", label: "NF-e Transferência" },
      ],
      placeholder: "Filtrar por tipo",
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "PENDENTE", label: "Pendente" },
        { value: "APROVADA", label: "Aprovada" },
        { value: "FINALIZADA", label: "Finalizada" },
        { value: "CANCELADA", label: "Cancelada" },
      ],
      placeholder: "Filtrar por status",
    },
  ];

  const handleFilterChange = (_key: string, value: string) => {
    if (value) {
      fetchInvoices(value);
    } else {
      fetchInvoices();
    }
  };

  const actions = [
    {
      label: "VISUALIZAR",
      onClick: () => navigate("/notas/visualizar"),
      variant: "primary" as const,
      icon: <FaEye size={14} />,
    },
    {
      label: "DOWNLOAD",
      onClick: () => {
        // Implementar download da nota fiscal
      },
      variant: "primary" as const,
      icon: <FaDownload size={14} />,
    },
    {
      label: "EXCLUIR",
      onClick: () => {
        // Implementar exclusão da nota fiscal
      },
      variant: "danger" as const,
      icon: <FaTrash size={14} />,
    },
  ];

  if (loading) {
    return (
      <SideMenu title="NOTAS FISCAIS">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Carregando notas fiscais...</div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    return (
      <SideMenu title="NOTAS FISCAIS">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-lg">Erro: {error}</div>
        </div>
      </SideMenu>
    );
  }

  // Empty state when no invoices are found
  if (!invoices || invoices.length === 0) {
    return (
      <SideMenu title="NOTAS FISCAIS">
        <div className="space-y-6">
          {/* Header */}
          <PageHeader
            title="Notas Fiscais"
            subtitle="Gestão e emissão de documentos fiscais"
          >
            <button
              onClick={() => navigate("/notas/gerar")}
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus size={14} />
              Gerar Nota Fiscal
            </button>
          </PageHeader>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaFileInvoice size={64} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma nota fiscal encontrada
            </h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              Você ainda não possui notas fiscais cadastradas. Clique no botão
              abaixo para criar sua primeira nota fiscal.
            </p>
            <button
              onClick={() => navigate("/notas/gerar")}
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus size={14} />
              Criar Primeira Nota Fiscal
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  return (
    <SideMenu title="NOTAS FISCAIS">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Notas Fiscais"
          subtitle="Gestão e emissão de documentos fiscais"
        >
          <button
            onClick={() => navigate("/notas/gerar")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Gerar Nota Fiscal
          </button>
        </PageHeader>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Tabela */}
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={notasFiscaisData}
              className="border-agro-200"
            />
          </div>

          {/* Ações */}
          <ActionButtons
            actions={actions}
            title="AÇÕES"
            className="border-agro-200"
          />
        </div>
      </div>
    </SideMenu>
  );
}

export default NotasFiscaisPage;
