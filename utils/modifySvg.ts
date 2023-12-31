const fetchAndModifySVG = async (importFunction:any, color: string) => {
  try {
      const svgModule = await importFunction();
      console.log('SVG MODULE', svgModule)
      let svgContent = svgModule.default;
      const response = await fetch(svgContent.src);
      svgContent = await response.text();

    if (color) {
      svgContent = svgContent.replaceAll(/\$hairColor/g, color);
    }

    return svgContent;
  } catch (error) {
    console.error("Error loading SVG: ", error);
    return null;
  }
};


export default fetchAndModifySVG