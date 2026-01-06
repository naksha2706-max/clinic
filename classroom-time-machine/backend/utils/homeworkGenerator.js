// Simple homework generator placeholder

function generateHomework(topic, difficulty = 'medium') {
  return {
    id: `hw-${Date.now()}`,
    topic,
    difficulty,
    tasks: [`Question about ${topic} (1)`, `Question about ${topic} (2)`]
  };
}

module.exports = { generateHomework };
