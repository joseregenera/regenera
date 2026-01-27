import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Building, Trash2 } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { Facility, User, BenchmarkResult } from '../types';
import { getUserFacilities, calculateBenchmark, deleteFacility } from '../services/storageService';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [results, setResults] = useState<Record<string, BenchmarkResult>>({});
  const navigate = useNavigate();

  const refreshData = () => {
    const userFacilities = getUserFacilities(user.id);
    setFacilities(userFacilities);
    
    const computed: Record<string, BenchmarkResult> = {};
    userFacilities.forEach(f => {
      computed[f.id] = calculateBenchmark(f);
    });
    setResults(computed);
  };

  useEffect(() => {
    refreshData();
  }, [user.id]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (window.confirm("Are you sure? This will remove the facility from your portfolio and the public aggregates.")) {
      deleteFacility(id);
      refreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex md:items-center justify-between mb-8 flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Facilities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your buildings and view their performance.</p>
        </div>
        <Button onClick={() => navigate('/add-facility')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>

      {facilities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities added</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new benchmarking record.</p>
          <div className="mt-6">
            <Button onClick={() => navigate('/add-facility')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => {
            const res = results[facility.id];
            return (
              <Link key={facility.id} to={`/facility/${facility.id}`} className="group block">
                <Card className="h-full hover:shadow-md transition-shadow relative">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="gray">{facility.category}</Badge>
                        <h3 className="mt-2 text-lg font-medium text-gray-900 group-hover:text-brand-600 truncate max-w-[200px]">
                          {facility.internalLabel || 'Untitled Facility'}
                        </h3>
                        <p className="text-sm text-gray-500">{facility.areaM2.toLocaleString()} m²</p>
                      </div>
                      <div className="h-10 w-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                        <Building size={20} />
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Annual EUI</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {res ? Math.round(res.eui) : '-'} <span className="text-xs font-normal text-gray-500">kWh/m²/yr</span>
                          </p>
                        </div>
                         {res && res.percentile > 0 && res.isSufficientData && (
                            <div className="text-right">
                                <Badge variant={res.percentile > 75 ? 'success' : res.percentile > 25 ? 'warning' : 'gray'}>
                                  Top {100 - res.percentile}%
                                </Badge>
                            </div>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                     <span className="text-xs text-brand-600 font-medium group-hover:underline">View Details</span>
                     <button 
                       onClick={(e) => handleDelete(facility.id, e)}
                       className="text-gray-400 hover:text-red-600 transition-colors p-1"
                     >
                       <Trash2 size={14} />
                     </button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
