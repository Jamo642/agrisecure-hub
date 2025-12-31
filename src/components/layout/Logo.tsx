import { Leaf } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 36, text: 'text-2xl' },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="bg-primary rounded-lg p-1.5 shadow-md">
          <Leaf className="text-primary-foreground" size={sizes[size].icon} />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
      </div>
      {showText && (
        <span className={`font-display font-bold ${sizes[size].text} text-foreground`}>
          Agri<span className="text-primary">Nova</span>
        </span>
      )}
    </div>
  );
}