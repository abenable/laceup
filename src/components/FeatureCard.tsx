import { ComponentType, SVGProps } from "react";

interface FeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="bg-mono-light-800 dark:bg-mono-dark-800 p-6 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card hover:shadow-card-hover transition-all duration-300">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="p-3 bg-mono-dark dark:bg-mono-light rounded-full">
        <Icon className="w-6 h-6 text-mono-light dark:text-mono-dark" />
      </div>
      <h3 className="text-lg font-semibold text-mono-dark dark:text-mono-light">
        {title}
      </h3>
      <p className="text-mono-dark-600 dark:text-mono-light-600">
        {description}
      </p>
    </div>
  </div>
);

export default FeatureCard;
