// Mock components for Lovable functionality
export const LovableComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="lovable-component">{children}</div>;
};

export const MockEditor: React.FC = () => {
  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <h3>Mock Editor Component</h3>
      <p>This is a placeholder for Lovable editor functionality.</p>
    </div>
  );
};
