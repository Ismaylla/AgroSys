// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { SideMenu } from "../../../components/layout/SideMenu";
// import { PageHeader } from "../../../components/ui/PageHeader";
// import { FilterBar } from "../../../components/ui/FilterBar";
// import { DataTable } from "../../../components/ui/DataTable";
// // CONFLITO 1 RESOLVIDO: Mantenho os imports da sua branch (samille)
// // Nota: O ActionButtons estava comentado, então vamos mantê-lo assim.
// import { Pagination } from "../../../components/ui/Pagination";

// import {
//   FaPlus,
//   FaEye,
//   FaTrash,
//   FaDollarSign,
//   FaFileAlt,
//   FaSearch,
// } from "react-icons/fa";
// import { useSales } from "../../../hooks/useSales";

// function VendasPage() {
//   const navigate = useNavigate();
//   // Este bloco não estava em conflito, então o mantemos como está:
//   const {
//     sales,
//     loading,
//     error,
//     fetchSales,
//     deleteSale,
//     currentPage,
//     totalPages,
//     itemsPerPage,
//     totalItems,
//     setPage
//   } = useSales();

//   // O bloco useEffect está comentado no seu código, o que indica que a busca inicial
//   // está sendo gerenciada dentro do useSales, então o mantemos assim.
//   /*
//   useEffect(() => {
//     fetchSales();
//   }, [fetchSales]);
//   */

//   const handleDelete = async (saleId: string) => {
//     if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
//       try {
//         await deleteSale(saleId);
//       } catch {
//         // erro tratado
//       }
//     }
//   };

//   // Transformar dados das vendas para o formato da tabela (sem conflito)
//   const vendasData = sales.map((sale) => ({
//     id: sale.id,
//     data: new Date(sale.saleDate).toLocaleDateString("pt-BR"),
//     cliente: sale.uap?.responsible || "Cliente não identificado",
//     produto: sale.saleItems
//       .map((item) => `${item.product.name} (${item.quantity} un)`)
//       .join(", "),
//     quantidade: sale.saleItems
//       .reduce((total, item) => total + item.quantity, 0)
//       .toString(),
//     valor: `R$ ${sale.totalAmount.toLocaleString("pt-BR", {
//       minimumFractionDigits: 2,
//     })}`,
//     status:
//       sale.status === "COMPLETED"
//         ? "Concluída"
//         : sale.status === "PENDING"
//         ? "Pendente"
//         : "Cancelada",
//   }));

//   const columns = [
//     { key: "id", label: "N° Venda", align: "center" },
//     { key: "data", label: "Data", align: "center" },
//     { key: "cliente", label: "Cliente", align: "center" },
//     { key: "produto", label: "Produto", align: "center" },
//     { key: "quantidade", label: "Quantidade", align: "center" },
//     { key: "valor", label: "Valor", align: "center" },
//     { key: "status", label: "Status", align: "center" },
//     // A coluna de ações será implícita via renderActions e não precisa ser definida aqui.
//     // Se precisar que ela apareça no cabeçalho, adicione: { key: "actions", label: "AÇÕES", align: "center" },
//   ];

//   // Filtros... (sem conflito)

//   const filters = [
//     {
//       key: "status",
//       label: "Status",
//       options: [
//         { value: "COMPLETED", label: "Concluída" },
//         { value: "PENDING", label: "Pendente" },
//         { value: "CANCELLED", label: "Cancelada" },
//       ],
//       placeholder: "Filtrar por status",
//     },
//   ];

//   // Resumo financeiro... (sem conflito)

//   const totalVendas = sales
//     .filter((sale) => sale.status === "COMPLETED")
//     .reduce((total, sale) => total + sale.totalAmount, 0);

//   const vendasMes = sales.filter((sale) => sale.status === "COMPLETED").length;
//   const ticketMedio = vendasMes > 0 ? totalVendas / vendasMes : 0;

//   if (loading) {
//     // ...
//   }

//   if (error) {
//     // ...
//   }

//   return (
//     <SideMenu title="Vendas">
//       <div className="space-y-6">
//         {/* Header */}
//         <PageHeader
//         // ...
//         >
//           <button
//             onClick={() => navigate("/vendas/registrar")}
//             className="btn-primary flex items-center gap-2"
//           >
//             <FaPlus size={14} />
//             Nova Venda
//           </button>
//         </PageHeader>

//         {/* Filters */}
//         <FilterBar filters={filters}>
//           <button className="btn-secondary flex items-center gap-2">
//             <FaSearch size={14} />
//             Buscar
//           </button>
//         </FilterBar>

//         {/* Tabela de Vendas */}
//         <div className="flex gap-6">
//           <div className="flex-1">
//             <DataTable
//               columns={columns}
//               data={vendasData}
//               className="border-agro-200"
//               renderActions={(row) => (
//                 <div className="flex justify-center gap-2">
//                   <button
//                     onClick={() => navigate(`/vendas/visualizar/${row.id}`)}
//                     className="btn-primary p-1 rounded"
//                     title="Visualizar"
//                   >
//                     <FaEye size={12} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(row.id)}
//                     className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                     title="Excluir"
//                   >
//                     <FaTrash size={12} />
//                   </button>
//                 </div>
//               )}
//             />
//           </div>
//           {/* CONFLITO 2 RESOLVIDO: Mantenho o bloco de Paginação da sua branch (samille)
//               e removo o bloco de ActionsButtons que estava comentado. */}
//           <div className="w-full">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               totalItems={totalItems}
//               itemsPerPage={itemsPerPage}
//               onPageChange={setPage} // Passa a função setPage do hook
//             />
//           </div>
//         </div>

//         {/* Resumo Financeiro... (sem conflito) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* ... */}
//         </div>
//       </div>
//     </SideMenu>
//   );
// }

// export default VendasPage;

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SideMenu } from "../../../components/layout/SideMenu";
import { PageHeader } from "../../../components/ui/PageHeader";
import { FilterBar } from "../../../components/ui/FilterBar";
import { DataTable } from "../../../components/ui/DataTable";
// CONFLITO 1 RESOLVIDO: Mantenho os imports da sua branch (samille)
// Nota: O ActionButtons estava comentado, então vamos mantê-lo assim.
import { Pagination } from "../../../components/ui/Pagination";

import {
  FaPlus,
  FaEye,
  FaTrash,
  FaDollarSign,
  FaFileAlt,
  FaSearch,
} from "react-icons/fa";
import { useSales } from "../../../hooks/useSales";

function VendasPage() {
  const navigate = useNavigate();
  // Este bloco não estava em conflito, então o mantemos como está:
  const {
    sales,
    loading,
    error,
    fetchSales,
    deleteSale,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setPage
  } = useSales();

  // O bloco useEffect está comentado no seu código, o que indica que a busca inicial
  // está sendo gerenciada dentro do useSales, então o mantemos assim.
  /*
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);
  */

  const handleDelete = async (saleId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        await deleteSale(saleId);
      } catch {
        // erro tratado
      }
    }
  };

  // Transformar dados das vendas para o formato da tabela (sem conflito)
  const vendasData = sales.map((sale) => ({
    id: sale.id,
    data: new Date(sale.saleDate).toLocaleDateString("pt-BR"),
    cliente: sale.uap?.responsible || "Cliente não identificado",
    produto: sale.saleItems
      .map((item) => `${item.product.name} (${item.quantity} un)`)
      .join(", "),
    quantidade: sale.saleItems
      .reduce((total, item) => total + item.quantity, 0)
      .toString(),
    valor: `R$ ${sale.totalAmount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`,
    status:
      sale.status === "COMPLETED"
        ? "Concluída"
        : sale.status === "PENDING"
        ? "Pendente"
        : "Cancelada",
  }));

  const columns = [
    { key: "id", label: "N° VENDA", align: "center" }, // Ajustado para maiúsculas (padrão de ferramentas)
    { key: "data", label: "DATA", align: "center" }, // Ajustado para maiúsculas
    { key: "cliente", label: "CLIENTE", align: "center" }, // Ajustado para maiúsculas
    { key: "produto", label: "PRODUTO", align: "center" }, // Ajustado para maiúsculas
    { key: "quantidade", label: "QUANTIDADE", align: "center" }, // Ajustado para maiúsculas
    { key: "valor", label: "VALOR", align: "center" }, // Ajustado para maiúsculas
    { key: "status", label: "STATUS", align: "center" }, // Ajustado para maiúsculas
    { key: "actions", label: "AÇÕES", align: "center" }, // Adicionado o cabeçalho AÇÕES (como em ferramentas)
  ];

  // Filtros... (sem conflito)

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "COMPLETED", label: "Concluída" },
        { value: "PENDING", label: "Pendente" },
        { value: "CANCELLED", label: "Cancelada" },
      ],
      placeholder: "Filtrar por status",
    },
  ];

  // Resumo financeiro... (sem conflito)
  // Variáveis mantidas, mas o componente de resumo será removido no return

  const totalVendas = sales
    .filter((sale) => sale.status === "COMPLETED")
    .reduce((total, sale) => total + sale.totalAmount, 0);

  const vendasMes = sales.filter((sale) => sale.status === "COMPLETED").length;
  const ticketMedio = vendasMes > 0 ? totalVendas / vendasMes : 0;

  if (loading) {
    // ...
  }

  if (error) {
    // ...
  }

  return (
    // 1. Removemos o 'title' do SideMenu (a Ferramentas usa o PageHeader para o título)
    <SideMenu>
      <div className="space-y-6">
        {/* 2. Adicionamos Título e Subtítulo ao PageHeader */}
        <PageHeader
          title="Gestão de Vendas"
          subtitle="Controle e acompanhamento das vendas"
        >
          <button
            onClick={() => navigate("/vendas/registrar")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Nova Venda
          </button>
        </PageHeader>

        {/* 3. Filtros: Usamos o FilterBar sem o botão aninhado (como em Ferramentas) */}
        <FilterBar filters={filters} /* onFilterChange={...} se for usar */ />

        {/* 4. Tabela de Vendas e Paginação: Ajustamos a estrutura para replicar o layout de Ferramentas */}
        <div className="flex gap-6">
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={vendasData}
              className="border-agro-200"
              renderActions={(row) => (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/vendas/visualizar/${row.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Visualizar"
                  >
                    <FaEye size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                    title="Excluir"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              )}
            />
            
            {/* Paginação: Movida para dentro do 'flex-1' para ficar embaixo da tabela */}
            <div className="w-full mt-4"> {/* Adicionamos mt-4 para um pequeno espaçamento */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
              />
            </div>
          </div>
          {/* Removemos a div <div className="w-full"> que causava conflito de layout */}
        </div>

        {/* 5. Resumo Financeiro: Removido para padronizar com a tela de Ferramentas */}
        {/*
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          ...
        </div>
        */}
      </div>
    </SideMenu>
  );
}

export default VendasPage;