import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRealsStore } from '@/app/reels/store';
import { useUserStore } from '@/store/pages/explore/explorestore';

const BasicModal = () => {
  const [rellIdx, setRellIdx] = useState(0);
  const { rels, likeReals } = useRealsStore(); // Добавлено извлечение rels
  const { user, fechUser, postById, getPostById, deletComit } = useUserStore();

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    if (user?.id) {
      fechUser(user.id);
    }
  }, [user?.id, fechUser]);

  const handleLike = async (postId) => {
    if (!rels || !rels[rellIdx]) return;
    
    try {
      await likeReals(postId);
      // Обновляем данные пользователя после лайка
      if (user?.id) {
        await fechUser(user.id);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (!rels || rels.length === 0) return <div>Нет данных</div>;

  const currentReel = rels[rellIdx];

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <button
          onClick={() => handleLike(currentReel.postId)}
          className="cursor-pointer"
          aria-label={currentReel.isLiked ? 'Убрать лайк' : 'Поставить лайк'}
          disabled={!user} // Делаем кнопку неактивной если пользователь не загружен
        >
          <Heart
            size={34}
            fill={currentReel.isLiked ? 'red' : 'none'}
            stroke={currentReel.isLiked ? 'red' : user ? 'black' : 'gray'}
          />
        </button>
      </div>
    </div>
  );
};

export default BasicModal;