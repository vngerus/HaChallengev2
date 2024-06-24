import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSales } from '../redux/actions';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Empresas = () => {
  const dispatch = useDispatch();
  const { sales, loading, error } = useSelector(state => state.sales);

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-8">Cargando...</p>;
  if (error) return <p className="text-center mt-8">Error: {error}</p>;

  const calculateSalesByCompany = () => {
    return sales.reduce((acc, sale) => {
      if (!acc[sale.nameAgency]) acc[sale.nameAgency] = { total: 0, commission: 0 };
      acc[sale.nameAgency].total += sale.finalPrice;
      acc[sale.nameAgency].commission += sale.finalPrice * 0.025;
      return acc;
    }, {});
  };

  const calculateSalesByMonth = () => {
    return sales.reduce((acc, sale) => {
      const date = new Date(sale.datePayment);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthYear = `${month + 1}-${year}`;
      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear] += sale.finalPrice;
      return acc;
    }, {});
  };

  const salesByCompany = calculateSalesByCompany();
  const salesByMonth = calculateSalesByMonth();

  const sortedCompanies = Object.keys(salesByCompany).sort((a, b) => salesByCompany[b].total - salesByCompany[a].total);
  const maxCompany = sortedCompanies.length > 0 ? sortedCompanies[0] : null;
  const maxCompanyVentas = maxCompany ? salesByCompany[maxCompany].total : 0;

  const sortedMonths = Object.keys(salesByMonth).sort((a, b) => salesByMonth[b] - salesByMonth[a]);
  const maxMonth = sortedMonths.length > 0 ? sortedMonths[0] : null;
  const maxMonthVentas = maxMonth ? salesByMonth[maxMonth] : 0;
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getMonthName = (monthYear) => {
    const [month,] = monthYear.split('-');
    return monthNames[parseInt(month, 10) - 1];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mb-5">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="flex mb-2">
        <div className="shadow-md rounded my-6 p-4  border-b-2 border-gray-200 bg-gray-100 w-[36.5rem] flex-grow-0 mr-2">
          {maxCompany && (
            <div className="text-center">
              <h1 className="text-lg font-bold">Total ventas:</h1>
              <h2 className="text-xl mt-2 mb-1">{maxCompanyVentas.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</h2>
            </div>
          )}
        </div>
        <div className="shadow-md rounded my-6 p-4 border-b-2 border-gray-200 bg-gray-100 w-[36.5rem] flex-grow">
          {maxMonth && (
            <div className="text-center">
              <h1 className="text-lg font-bold">Mes con mayores ventas:</h1>
              <h2 className="text-xl mt-2 mb-1">{getMonthName(maxMonth)} - {maxMonthVentas.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</h2>
            </div>
          )}
        </div>
      </div>

      <div className="w-4/5 bg-white shadow-md rounded my-6">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-purple-200">
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre Empresa</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total de Ventas</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Comisión</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-purple-100' : 'bg-purple-50'}`}>
                <td className="px-5 py-5 border-b border border-gray-200 bg-white text-sm">{company}</td>
                <td className="px-5 py-5 border-b border border-gray-200 bg-white text-right text-sm">{salesByCompany[company].total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                <td className="px-5 py-5 border-b border border-gray-200 bg-white text-right text-sm">{salesByCompany[company].commission.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                <td className="px-5 py-5 border-b border border-gray-200 bg-white text-right text-sm">
                  <Link to={`/empresas/${encodeURIComponent(company)}`} className="text-blue-500 hover:underline">Ver Detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empresas;
