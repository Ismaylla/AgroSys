import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/layout/SideMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useHarvest } from "@/hooks/useHarvest";
import { Pagination } from "@/components/ui/Pagination";
import { useQuery } from "@tanstack/react-query";

// ***************
// IMPORTANTE:
// Você deve ter este import na main, mas ele não está no topo.
// Adicione 'useQuery' se ele for necessário.
// import { useQuery } from "react-query";
// ***************

function ColheitaPage() {
  const navigate = useNavigate();

  // CONFLITO 1 RESOLVIDO:
  // Mantenho as FUNÇÕES de ação da sua branch (samille)
  // e adoto o novo padrão de busca de dados da branch (main)
  const { deleteHarvest, fetchHarvests, setPage } = useHarvest();

  // Nota: Presumi que você precisa de 'setPage' da sua branch para a paginação.
  // Se o hook useHarvest não tiver mais 'currentPage', 'totalPages', etc.
  // você terá que buscar essas variáveis de outra forma (ex: do useQuery, se for o caso)

  const { data: harvestsData, isLoading } = useQuery({
    queryKey: ["colheitas"],
    queryFn: () => fetchHarvests(),
  });

  // Usando um fallback temporário para evitar quebras se as variáveis de paginação não vierem do useQuery
  // Você precisará revisar esta parte!
  const harvests = harvestsData?.items || [];
  const currentPage = harvestsData?.currentPage || 1;
  const totalPages = harvestsData?.totalPages || 1;
  const itemsPerPage = harvestsData?.itemsPerPage || 10;
  const totalItems = harvestsData?.totalItems || 0;
  const error = harvestsData?.error; // Presumi que o erro não foi alterado.

  const handleDelete = async (harvestId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta colheita?")) {
      try {
        await deleteHarvest(harvestId);
      } catch {
        // erro tratado
      }
    }
  };

  // CONFLITO 2 RESOLVIDO: Combino a estrutura da 'main' (com 'align: center')
  // e adiciono a coluna 'actions' da sua branch (samille).
  const columns = [
    { key: "id", label: "N° COLHEITA", align: "center" },
    { key: "data", label: "DATA", align: "center" },
    { key: "produto", label: "PRODUTO", align: "center" },
    { key: "quantidade", label: "QUANTIDADE", align: "center" },
    { key: "uap", label: "UAP", align: "center" },
    { key: "responsavel", label: "RESPONSÁVEL", align: "center" },
    { key: "ciclo", label: "CICLO", align: "center" },
    { key: "status", label: "STATUS", align: "center" },
    { key: "actions", label: "AÇÕES", align: "center" }, // Coluna de ações
  ];

  const filters = [
    {
      key: "produto",
      label: "Produto",
      options: [
        { value: "soja", label: "Soja Grão" },
        { value: "milho", label: "Milho Verde" },
        { value: "feijao", label: "Feijão Carioca" },
        { value: "arroz", label: "Arroz Branco" },
        { value: "trigo", label: "Trigo" },
        { value: "cafe", label: "Café Arábica" },
        { value: "algodao", label: "Algodão" },
        { value: "cana", label: "Cana-de-açúcar" },
      ],
      placeholder: "Filtrar por produto",
    },
    {
      key: "ciclo",
      label: "Ciclo",
      options: [
        { value: "verao", label: "Verão" },
        { value: "inverno", label: "Inverno" },
        { value: "safrinha", label: "Safrinha" },
        { value: "perene", label: "Perene" },
      ],
      placeholder: "Filtrar por ciclo",
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "concluida", label: "Concluída" },
        { value: "em-andamento", label: "Em Andamento" },
        { value: "agendada", label: "Agendada" },
        { value: "cancelada", label: "Cancelada" },
      ],
      placeholder: "Filtrar por status",
    },
  ];

  if (isLoading) {
    // Troquei 'loading' por 'isLoading' do useQuery
    return (
      <SideMenu title="COLHEITA">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando colheitas...</p>
          </div>
        </div>
      </SideMenu>
    );
  }

  if (error) {
    return (
      <SideMenu title="COLHEITA">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Erro ao carregar colheitas: {error}
            </p>
            <button onClick={() => fetchHarvests()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        </div>
      </SideMenu>
    );
  }

  return (
    <SideMenu title="COLHEITA">
      <div className="space-y-6">
        <PageHeader
          title="Gestão de Colheitas"
          subtitle="Controle e acompanhamento das colheitas"
        >
          <button
            onClick={() => navigate("/colheita/nova")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus size={14} />
            Registrar Nova Colheita
          </button>
        </PageHeader>

        <FilterBar
          filters={filters}
          onFilterChange={(_key, _value) => {
            // Implementar filtros
          }}
        />

        <div className="flex gap-6">
          <div className="flex-1">
            <DataTable
              columns={columns}
              data={harvests.map((harvest) => ({
                id: harvest.id,
                data: new Date(harvest.harvestDate).toLocaleDateString("pt-BR"),
                produto: harvest.product,
                quantidade: `${harvest.quantity} ${harvest.unit}`,
                uap: harvest.uap,
                responsavel: harvest.responsible,
                ciclo: harvest.cycle,
                status: harvest.status,
                // A COLUNA 'actions' FOI REMOVIDA DESTE MAP
              }))}
              className="border-agro-200"
              // CONFLITO 3 RESOLVIDO: Mantenho o novo prop 'renderActions' da main
              // e adapto o seu conteúdo (botões) da sua branch (samille).
              renderActions={(row) => (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/colheita/visualizar/${row.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Visualizar"
                  >
                    <FaEye size={12} />
                  </button>
                  <button
                    onClick={() => navigate(`/colheita/editar/${row.id}`)}
                    className="btn-primary p-1 rounded"
                    title="Editar"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id as string)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                    title="Excluir"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              )}
            />
            {/* Paginação */}
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </SideMenu>
  );
}

export default ColheitaPage;

// import { useNavigate } from "react-router-dom";
// import { SideMenu } from "@/components/layout/SideMenu";
// import { PageHeader } from "@/components/ui/PageHeader";
// import { FilterBar } from "@/components/ui/FilterBar";
// import { DataTable } from "@/components/ui/DataTable";
// import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
// import { useHarvest } from "@/hooks/useHarvest";
// import { Pagination } from "@/components/ui/Pagination";

// function ColheitaPage() {
//   const navigate = useNavigate();
// <<<<<<< samille
//   const {
//     harvests,
//     loading,
//     error,
//     fetchHarvests,
//     deleteHarvest,
//     currentPage,
//     totalPages,
//     itemsPerPage,
//     totalItems,
//     setPage,
//   } = useHarvest();
// =======
//   const { harvests, loading, error, fetchHarvests, deleteHarvest } =
//     useHarvest();

//   const { data, isLoading } = useQuery({
//     queryKey: ["colheitas"],
//     queryFn: () => fetchHarvests(),
//   });
// >>>>>>> main

//   const handleDelete = async (harvestId: string) => {
//     if (window.confirm("Tem certeza que deseja excluir esta colheita?")) {
//       try {
//         await deleteHarvest(harvestId);
//       } catch {
//         // erro tratado
//       }
//     }
//   };

//   // Colunas centralizadas
//   const columns = [
// <<<<<<< samille
//     { key: "id", label: "N° COLHEITA" },
//     { key: "data", label: "DATA" },
//     { key: "produto", label: "PRODUTO" },
//     { key: "quantidade", label: "QUANTIDADE" },
//     { key: "uap", label: "UAP" },
//     { key: "responsavel", label: "RESPONSÁVEL" },
//     { key: "ciclo", label: "CICLO" },
//     { key: "status", label: "STATUS" },
//     { key: "actions", label: "AÇÕES" }, // coluna de ações igual produtos
// =======
//     { key: "id", label: "N° COLHEITA", align: "center" },
//     { key: "data", label: "DATA", align: "center" },
//     { key: "produto", label: "PRODUTO", align: "center" },
//     { key: "quantidade", label: "QUANTIDADE", align: "center" },
//     { key: "uap", label: "UAP", align: "center" },
//     { key: "responsavel", label: "RESPONSÁVEL", align: "center" },
//     { key: "ciclo", label: "CICLO", align: "center" },
//     { key: "status", label: "STATUS", align: "center" },
// >>>>>>> main
//   ];

//   const filters = [
//     {
//       key: "produto",
//       label: "Produto",
//       options: [
//         { value: "soja", label: "Soja Grão" },
//         { value: "milho", label: "Milho Verde" },
//         { value: "feijao", label: "Feijão Carioca" },
//         { value: "arroz", label: "Arroz Branco" },
//         { value: "trigo", label: "Trigo" },
//         { value: "cafe", label: "Café Arábica" },
//         { value: "algodao", label: "Algodão" },
//         { value: "cana", label: "Cana-de-açúcar" },
//       ],
//       placeholder: "Filtrar por produto",
//     },
//     {
//       key: "ciclo",
//       label: "Ciclo",
//       options: [
//         { value: "verao", label: "Verão" },
//         { value: "inverno", label: "Inverno" },
//         { value: "safrinha", label: "Safrinha" },
//         { value: "perene", label: "Perene" },
//       ],
//       placeholder: "Filtrar por ciclo",
//     },
//     {
//       key: "status",
//       label: "Status",
//       options: [
//         { value: "concluida", label: "Concluída" },
//         { value: "em-andamento", label: "Em Andamento" },
//         { value: "agendada", label: "Agendada" },
//         { value: "cancelada", label: "Cancelada" },
//       ],
//       placeholder: "Filtrar por status",
//     },
//   ];

//   if (loading) {
//     return (
//       <SideMenu title="COLHEITA">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-600 mx-auto mb-4"></div>
//             <p className="text-neutral-600">Carregando colheitas...</p>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   if (error) {
//     return (
//       <SideMenu title="COLHEITA">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <p className="text-red-600 mb-4">
//               Erro ao carregar colheitas: {error}
//             </p>
//             <button onClick={() => fetchHarvests()} className="btn-primary">
//               Tentar novamente
//             </button>
//           </div>
//         </div>
//       </SideMenu>
//     );
//   }

//   return (
//     <SideMenu title="COLHEITA">
//       <div className="space-y-6">
//         <PageHeader
//           title="Gestão de Colheitas"
//           subtitle="Controle e acompanhamento das colheitas"
//         >
//           <button
//             onClick={() => navigate("/colheita/nova")}
//             className="btn-primary flex items-center gap-2"
//           >
//             <FaPlus size={14} />
//             Registrar Nova Colheita
//           </button>
//         </PageHeader>

//         <FilterBar
//           filters={filters}
//           onFilterChange={(_key, _value) => {
//             // Implementar filtros
//           }}
//         />

//         <div className="flex gap-6">
//           <div className="flex-1">
//             <DataTable
//               columns={columns}
//               data={harvests.map((harvest) => ({
//                 id: harvest.id,
//                 data: new Date(harvest.harvestDate).toLocaleDateString("pt-BR"),
//                 produto: harvest.product,
//                 quantidade: `${harvest.quantity} ${harvest.unit}`,
//                 uap: harvest.uap,
//                 responsavel: harvest.responsible,
//                 ciclo: harvest.cycle,
//                 status: harvest.status,
//                 actions: (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         navigate(`/colheita/visualizar/${harvest.id}`)
//                       }
//                       className="btn-primary p-1 rounded"
//                       title="Visualizar"
//                     >
//                       <FaEye size={12} />
//                     </button>
//                     <button
//                       onClick={() =>
//                         navigate(`/colheita/editar/${harvest.id}`)
//                       }
//                       className="btn-primary p-1 rounded"
//                       title="Editar"
//                     >
//                       <FaEdit size={12} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(harvest.id)}
//                       className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                       title="Excluir"
//                     >
//                       <FaTrash size={12} />
//                     </button>
//                   </div>
//                 ),
//               }))}
//               className="border-agro-200"
// <<<<<<< samille
// =======
//               renderActions={(row) => (
//                 <div className="flex justify-center gap-2">
//                   <button
//                     onClick={() => navigate(`/colheita/visualizar/${row.id}`)}
//                     className="btn-primary p-1 rounded"
//                     title="Visualizar"
//                   >
//                     <FaEye size={12} />
//                   </button>
//                   <button
//                     onClick={() => navigate(`/colheita/editar/${row.id}`)}
//                     className="btn-primary p-1 rounded"
//                     title="Editar"
//                   >
//                     <FaEdit size={12} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(row.id as string)}
//                     className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                     title="Excluir"
//                   >
//                     <FaTrash size={12} />
//                   </button>
//                 </div>
//               )}
// >>>>>>> main
//             />
//             {/* Paginação */}
//             <div className="mt-4">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 totalItems={totalItems}
//                 itemsPerPage={itemsPerPage}
//                 onPageChange={setPage}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </SideMenu>
//   );
// }

// export default ColheitaPage;
