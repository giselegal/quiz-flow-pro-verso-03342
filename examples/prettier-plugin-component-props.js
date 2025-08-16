// Plugin customizado para organizar propriedades de componentes
const plugin = {
  name: "prettier-plugin-component-props",

  // Organizar props por categoria
  organizeProps: props => {
    const categories = {
      data: ["block", "blockDefinition", "data", "content"],
      events: ["onClick", "onUpdateBlock", "onChange", "onClose"],
      styling: ["className", "style", "variant", "size", "color"],
      state: ["disabled", "loading", "selected", "active"],
      other: [],
    };

    // Implementação do organizador
    return props.sort((a, b) => {
      const categoryA = getCategoryForProp(a, categories);
      const categoryB = getCategoryForProp(b, categories);

      if (categoryA !== categoryB) {
        return categoryOrder.indexOf(categoryA) - categoryOrder.indexOf(categoryB);
      }

      return a.name.localeCompare(b.name);
    });
  },
};

module.exports = plugin;
