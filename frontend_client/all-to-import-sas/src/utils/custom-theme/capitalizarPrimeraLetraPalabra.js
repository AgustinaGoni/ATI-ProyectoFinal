export const capitalizarPrimeraLetraPalabra = (string) => {
  const prepositions = ['a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'en', 'entre', 'hacia', 'hasta', 'para', 'por', 'según', 'sin', 'sobre', 'tras'];
  
  return string
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index !== 0 && prepositions.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

}