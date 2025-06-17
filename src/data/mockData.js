// Mock book data with chapters grouped by volumes/sections
export const bookData = {
  title: "The Chronicles of Aetheria",
  author: "J.R. Fantasist",
  description: "An epic fantasy saga spanning multiple volumes and adventures",
  volumes: [
    {
      id: "volume-1",
      title: "Volume I: The Awakening",
      description: "The beginning of an extraordinary journey",
      chapters: [
        {
          id: "ch-1-1",
          title: "The Mysterious Letter",
          volumeId: "volume-1",
          content: `
            <h1>Chapter 1: The Mysterious Letter</h1>
            <p>The morning sun cast long shadows across the cobblestone streets of Millbrook as Elena hurried toward the old oak tree at the edge of town. In her hand, she clutched a letter that had arrived mysteriously the night before, bearing no return address and sealed with an unusual crimson wax.</p>
            
            <p>The letter had simply appeared on her windowsill, as if placed there by some invisible hand. Its contents were even more puzzling than its arrival:</p>
            
            <blockquote>
              <p><em>"Dear Elena,</em></p>
              <p><em>Your destiny awaits beyond the veil of the ordinary world. Meet me at the ancient oak when the church bells toll nine. Come alone, and bring nothing but your courage.</em></p>
              <p><em>A friend in the shadows"</em></p>
            </blockquote>
            
            <p>As she approached the massive tree, its gnarled branches seeming to reach toward her like ancient fingers, Elena felt a strange tingling in the air. The very atmosphere seemed charged with an energy she had never experienced before.</p>
            
            <p>Suddenly, a figure emerged from behind the oak's massive trunk...</p>
          `,
          wordCount: 1250,
          estimatedReadTime: 5
        },
        {
          id: "ch-1-2",
          title: "The Guardian's Secret",
          volumeId: "volume-1",
          content: `
            <h1>Chapter 2: The Guardian's Secret</h1>
            <p>The figure that stepped from behind the oak was not what Elena had expected. Instead of the mysterious stranger she had imagined, she found herself face to face with Mrs. Whitmore, the elderly librarian who had worked at the town library for as long as anyone could remember.</p>
            
            <p>"Mrs. Whitmore?" Elena gasped, her voice barely above a whisper. "You sent the letter?"</p>
            
            <p>The old woman's eyes twinkled with an otherworldly light as she smiled. "Indeed, child. Though I suspect you have many questions, and rightfully so. What I am about to tell you will change everything you thought you knew about our quiet little town."</p>
            
            <p>Mrs. Whitmore gestured toward the oak tree, and Elena noticed for the first time that strange symbols were carved into its bark, symbols that seemed to glow faintly in the morning light.</p>
            
            <p>"This tree," Mrs. Whitmore continued, "is far more than it appears. It is a gateway, Elena. A bridge between our world and the realm of Aetheria, where magic flows like rivers and ancient powers still hold sway."</p>
            
            <p>Elena's mind reeled. Magic? Other worlds? It sounded like something from the fantasy novels she loved to read, not something that could be real in her ordinary life.</p>
          `,
          wordCount: 1180,
          estimatedReadTime: 5
        },
        {
          id: "ch-1-3",
          title: "Through the Portal",
          volumeId: "volume-1",
          content: `
            <h1>Chapter 3: Through the Portal</h1>
            <p>As Mrs. Whitmore placed her weathered hand against the glowing symbols on the oak tree, the air around them began to shimmer and dance like heat waves rising from summer pavement. Elena watched in amazement as the space between the tree's roots began to expand, revealing not earth and stone, but a swirling vortex of silver and blue light.</p>
            
            <p>"This is your choice, Elena," Mrs. Whitmore said, her voice carrying a weight of centuries. "You can turn away now, return to your normal life, and forget this ever happened. Or you can step through and discover the truth about who you really are."</p>
            
            <p>Elena's heart pounded in her chest. Every rational part of her mind screamed that this was impossible, that she should run home and pretend none of this was real. But there was something else, a deeper voice that whispered of adventure, of purpose, of a destiny she had always felt calling to her from just beyond the edge of her ordinary world.</p>
            
            <p>"What am I?" she asked, surprised by the steadiness of her own voice.</p>
            
            <p>Mrs. Whitmore smiled, and for a moment, Elena could have sworn she saw the face of a much younger woman beneath the wrinkles and gray hair.</p>
            
            <p>"You, my dear, are a Dreamweaver. And Aetheria has been waiting for you for a very long time."</p>
          `,
          wordCount: 1320,
          estimatedReadTime: 6
        }
      ]
    },
    {
      id: "volume-2",
      title: "Volume II: The Realm of Wonders",
      description: "Elena discovers the magical world of Aetheria",
      chapters: [
        {
          id: "ch-2-1",
          title: "First Steps in Aetheria",
          volumeId: "volume-2",
          content: `
            <h1>Chapter 4: First Steps in Aetheria</h1>
            <p>The sensation of stepping through the portal was unlike anything Elena had ever experienced. It felt as though she was being gently pulled apart and reassembled, molecule by molecule, in the space of a heartbeat. When the disorientation faded, she found herself standing in a world that defied every law of physics she had ever learned.</p>
            
            <p>The sky above was a tapestry of colors that had no names in her world—deep purples that shifted to golden amber, streaked with silver clouds that moved in patterns too perfect to be natural. Three moons hung in the heavens, each a different size and hue, casting their combined light over a landscape that seemed painted by the dreams of gods.</p>
            
            <p>Crystalline trees rose around them, their translucent branches chiming softly in a breeze that carried the scent of flowers that bloomed only in imagination. In the distance, floating islands drifted lazily through the air, connected by bridges of pure light that sparkled like captured starlight.</p>
            
            <p>"Welcome to Aetheria," Mrs. Whitmore said, though her voice sounded different here—younger, more vibrant. Elena turned to look at her companion and gasped.</p>
            
            <p>The elderly librarian was gone. In her place stood a woman who appeared to be in her thirties, with flowing silver hair and eyes that held the depth of centuries. She wore robes that seemed to be woven from moonbeams and starlight.</p>
            
            <p>"I am Lyralei," the woman said with a gentle smile. "Guardian of the Gateway and Keeper of the Ancient Lore. What you knew as Mrs. Whitmore was merely the form I took to watch over you in your world."</p>
          `,
          wordCount: 1450,
          estimatedReadTime: 6
        },
        {
          id: "ch-2-2",
          title: "The Academy of Dreams",
          volumeId: "volume-2",
          content: `
            <h1>Chapter 5: The Academy of Dreams</h1>
            <p>Lyralei led Elena along a path that seemed to form itself beneath their feet with each step they took. The crystalline trees gave way to a vast meadow where flowers sang in harmonious whispers and butterflies with wings like stained glass windows danced in the eternal twilight.</p>
            
            <p>"Where are we going?" Elena asked, still struggling to process the impossibility of everything around her.</p>
            
            <p>"To the Academy of Dreams," Lyralei replied. "It is where all Dreamweavers come to learn their craft. You have much to discover about your abilities, Elena. The power that flows through you is ancient and rare."</p>
            
            <p>As they crested a hill, Elena saw their destination spread out before them like something from a fairy tale. The Academy was a collection of towers and spires that seemed to grow organically from the landscape itself, their walls shifting between solid stone and translucent crystal depending on the angle of view. Gardens floated at various levels around the buildings, connected by staircases that spiraled through the air without any visible support.</p>
            
            <p>"It's beautiful," Elena breathed.</p>
            
            <p>"And it will be your home while you learn," Lyralei said. "But first, you must understand what it means to be a Dreamweaver. We are the guardians of the boundary between dreams and reality, the weavers of possibility itself."</p>
          `,
          wordCount: 1200,
          estimatedReadTime: 5
        }
      ]
    },
    {
      id: "volume-3",
      title: "Volume III: The Shadow Rising",
      description: "Dark forces threaten both worlds",
      chapters: [
        {
          id: "ch-3-1",
          title: "Whispers of Darkness",
          volumeId: "volume-3",
          content: `
            <h1>Chapter 6: Whispers of Darkness</h1>
            <p>Three months had passed since Elena first arrived at the Academy of Dreams, and she had grown more comfortable with her abilities as a Dreamweaver. She could now shape small objects from pure thought, walk through the dreams of sleeping creatures, and even glimpse possible futures in the swirling mists of the Prophecy Pool.</p>
            
            <p>But lately, something had been troubling the usually serene atmosphere of Aetheria. The crystal trees had begun to dim, their melodious chimes taking on discordant notes. The floating islands moved more erratically, and even the three moons seemed to flicker with an uncertain light.</p>
            
            <p>"Master Lyralei," Elena said as she found her mentor in the Academy's highest tower, gazing out at the troubled landscape. "What's happening to Aetheria?"</p>
            
            <p>Lyralei's expression was grave as she turned to face her student. "An ancient evil stirs, Elena. The Void Seekers, beings of pure darkness who seek to unmake all of creation, have found a way to breach the barriers between worlds. They feed on dreams and hope, leaving only emptiness in their wake."</p>
            
            <p>Elena felt a chill run down her spine. "What can we do?"</p>
            
            <p>"We must gather the other Dreamweavers," Lyralei said. "For the first time in a thousand years, we must prepare for war."</p>
          `,
          wordCount: 1100,
          estimatedReadTime: 5
        }
      ]
    }
  ]
};

// Helper functions for working with the book data
export const getAllChapters = () => {
  return bookData.volumes.flatMap(volume => volume.chapters);
};

export const getChapterById = (id) => {
  return getAllChapters().find(chapter => chapter.id === id);
};

export const getVolumeById = (id) => {
  return bookData.volumes.find(volume => volume.id === id);
};

export const getChaptersByVolume = (volumeId) => {
  const volume = getVolumeById(volumeId);
  return volume ? volume.chapters : [];
};

export const getTotalChapters = () => {
  return getAllChapters().length;
};

export const getNextChapter = (currentChapterId) => {
  const chapters = getAllChapters();
  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);
  return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
};

export const getPreviousChapter = (currentChapterId) => {
  const chapters = getAllChapters();
  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);
  return currentIndex > 0 ? chapters[currentIndex - 1] : null;
};
