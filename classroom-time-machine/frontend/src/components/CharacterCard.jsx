import React from 'react';

export default function CharacterCard({ character }) {
  return (
    <div className="character-card">
      <strong>{character.name}</strong>
      <p>{character.role}</p>
    </div>
  );
}
