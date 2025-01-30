const badWordsList = [
    'Tanginamo', 'Gago', 'Bobo', 'Panget', 'pakyu', 'iskwater', 'walanghiya', 
    'bwiset', 'walang kwenta', 'tanga', 'inutil', 'Puta', 'Gaga', 'pokpok', 
    'bitch', 'Motherfucker', 'asshole'
  ]; // Add more words as needed
  
  export const filterBadWords = (text) => {
    const regex = new RegExp(badWordsList.join('|'), 'gi');
  
    if (regex.test(text)) {
      window.alert('Warning: Your sentence contains inappropriate language and has been filtered.');
    }
  
    return text.replace(regex, (match) => '*'.repeat(match.length));
  };
  