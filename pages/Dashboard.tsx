import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Building, Trash2, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { getMyFacilities, deleteFacility } from '../services/supabaseService';

export const Dashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyFacilities();
      setFacilities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Delete this submission? It will be removed from the national baseline calculations.")) {
      await deleteFacility(id);
      load();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-brand-500">My Portfolio</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and view performance reports for buildings submitted from this device.</p>
        </div>
        <Button onClick={() => navigate('/add-facility')} className="px-8 py-4 bg-brand-accent text-brand-500 font-black rounded-xl hover:bg-yellow-500">
          <Plus size={20} className="mr-2"/> New Submission
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-bold text-gray-300 italic">Syncing with database...</div>
      ) : facilities.length === 0 ? (
        <Card className="p-20 text-center border-dashed border-2 border-gray-200 shadow-none">
           <Building className="mx-auto text-gray-200 mb-6" size={64}/>
           <h3 className="text-xl font-bold text-gray-900">No submissions found</h3>
           <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start contributing to the baseline by adding your first facility record.</p>
           <Button onClick={() => navigate('/add-facility')}>Get Started</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {facilities.map(f => (
             <Link key={f.id} to={`/facility/${f.id}`} className="group">
               <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500">
                        <Building size={24}/>
                     </div>
                     <button onClick={e => handleDelete(f.id, e)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16}/>
                     </button>
                  </div>
                  
                  <Badge variant="gray" className="mb-2 self-start">{f.category}</Badge>
                  <h3 className="text-xl font-black text-brand-500 group-hover:text-brand-secondary transition-colors mb-2">
                    {f.internalLabel || "Unnamed Facility"}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{f.areaM2} m²</p>
                  
                  <div className="mt-auto pt-8 flex items-center justify-between text-brand-500 font-black border-t border-gray-50">
                     <span className="text-sm uppercase tracking-tighter">View Report</span>
                     <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform"/>
                  </div>
               </Card>
             </Link>
           ))}
        </div>
      )}
    </div>
  );
};