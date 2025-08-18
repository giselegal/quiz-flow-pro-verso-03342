interface SecondaryStylesSectionProps {
  secondaryStyles: any[];
}

export default function SecondaryStylesSection({ secondaryStyles }: SecondaryStylesSectionProps) {
  return (
    <div>
      {secondaryStyles && secondaryStyles.length > 0 ? (
        <ul>
          {secondaryStyles.map((style, idx) => (
            <li key={idx}>{JSON.stringify(style)}</li>
          ))}
        </ul>
      ) : (
        <p>Sem estilos secundários</p>
      )}
    </div>
  );
}
