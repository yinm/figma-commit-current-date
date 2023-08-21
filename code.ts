interface pluginMessage {
  title: string;
  referenceUrl: string;
}

figma.showUI(__html__);

figma.ui.onmessage = async ({ title, referenceUrl }: pluginMessage) => {
  if (figma.currentPage.selection.length !== 1) {
    figma.closePlugin("Select a single node.");
    // for type guard
    return;
  }

  const node = figma.currentPage.selection[0];
  if (node.type !== "TEXT") {
    figma.closePlugin("Select a single text node.");
    // for type guard
    return;
  }

  if (node.fontName === figma.mixed) {
    figma.closePlugin("Require single fontName property.");
    // for type guard
    return;
  }

  await figma.loadFontAsync(node.fontName);

  const todaysDate = new Date().toISOString().replace(/T.+/, "");
  node.characters = todaysDate;

  await new Promise((r) => setTimeout(r, 1000));
  await figma.saveVersionHistoryAsync(title, `reference url: ${referenceUrl}`);
  figma.closePlugin("Success!");
};
