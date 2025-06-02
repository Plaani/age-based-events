
import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  type: 'available' | 'registered' | 'volunteer';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const navigate = useNavigate();
  
  // Configure based on empty state type
  const config = {
    available: {
      icon: <Calendar className="h-6 w-6 text-gray-400" />,
      title: "Üritusi ei leitud",
      description: "Proovi filtreid muuta, et leida üritusi",
      button: null
    },
    registered: {
      icon: <Calendar className="h-6 w-6 text-gray-400" />,
      title: "Pole registreeritud üritusi",
      description: "Sa pole veel ühelegi üritusele registreerunud",
      button: null
    },
    volunteer: {
      icon: <Users className="h-6 w-6 text-gray-400" />,
      title: "Vabatahtliku töö võimalused",
      description: "Siin kuvatakse vabatahtliku töö võimalused. Tulekul!",
      button: (
        <Button className="mt-4" onClick={() => navigate('/volunteers')}>
          Mine vabatahtlike töölauaga
        </Button>
      )
    }
  };
  
  const { icon, title, description, button } = config[type];

  return (
    <div className="text-center py-12 border rounded-md bg-gray-50">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
      {button}
    </div>
  );
};

export default EmptyState;
