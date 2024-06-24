import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Navbar from './Navbar';

const Detalle = () => {
  const { id } = useParams();
  const { sales } = useSelector(state => state.sales);

  const companySales = sales.filter(sale => sale.nameAgency === id);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); 

  const pageSize = 5; 

  const filteredSales = companySales.filter(sale =>
    sale.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSales = filteredSales.sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA < fieldB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const offset = currentPage * pageSize;
  const paginatedData = sortedSales.slice(offset, offset + pageSize);
  const pageCount = Math.ceil(filteredSales.length / pageSize);

  const handlePageClick = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? <FaArrowUp className="ml-2 inline" /> : <FaArrowDown className="ml-2 inline" />;
    }
    return <FaArrowUp className="ml-2 inline opacity-50" />;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mb-2">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="container mx-auto">
        <div className="bg-white p-2 mb-2 w-full mt-2">
          <h1 className="text-2xl text-center">
            <Link to="/empresas" className="text-blue-500 hover:underline">Empresas</Link> {" > "} {id}
          </h1>
        </div>
        <div className="w-full">
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              placeholder="Buscar por Nombre Cliente"
              className="p-2 border border-gray-300 rounded-md w-80"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full bg-white shadow-md rounded my-6">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre Cliente {renderSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('persons')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Personas {renderSortIcon('persons')}
                  </th>
                  <th onClick={() => handleSort('day')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Día {renderSortIcon('day')}
                  </th>
                  <th onClick={() => handleSort('hour')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hora {renderSortIcon('hour')}
                  </th>
                  <th onClick={() => handleSort('finalPrice')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Valor Venta {renderSortIcon('finalPrice')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((sale, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border border-gray-200 bg-white text-sm">{sale.name}</td>
                    <td className="px-5 py-5 border-b border border-gray-200 bg-white text-right text-sm">{sale.persons}</td>
                    <td className="px-5 py-5 border-b border border-gray-200 bg-white text-right text-sm">{sale.day}</td>
                    <td className="px-5 py-5 border-b border border-gray-200 bg-white text-right text-sm">{sale.hour}</td>
                    <td className="px-5 py-5 border-b border border-gray-200 bg-white text-right text-sm">{sale.finalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <nav className="relative z-0 inline-flex shadow-sm">
              <div className="-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  className={`${
                    currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  } px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100`}
                  disabled={currentPage === 0}
                >
                  Anterior
                </button>
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(index)}
                    className={`${
                      currentPage === index
                        ? 'bg-purple-100 border-purple-500 text-purple-600'
                        : 'bg-white'
                    } px-3 py-1 border border-gray-300 hover:bg-gray-100`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  className={`${
                    currentPage === pageCount - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100`}
                  disabled={currentPage === pageCount - 1}
                >
                  Siguiente
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detalle;
