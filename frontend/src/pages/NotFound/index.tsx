import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import { scaleIn } from '../../hooks/useAnimations';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md"
      >
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Search className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/doctors')}
          >
            Browse Doctors
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
