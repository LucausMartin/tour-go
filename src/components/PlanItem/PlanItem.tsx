import { FC, useState, useEffect } from 'react';
import { FavoriteBorder } from '@mui/icons-material';
import image1 from '../../assets/img/1.webp';
import avatar from '../../assets/avatar.jpg';

const PlanItem: FC<{ articleID: string; userName: string }> = ({ articleID, userName }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>(userName);
  const [likeNumber, setLikeNumber] = useState<string>('');

  useEffect(() => {
    // fetch data
    setImgSrc(image1);
    setAvatarSrc(avatar);
    setDescription('descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription');
    setName('其实就是一个用户名，but长一点');
    setLikeNumber('10');
  }, [articleID]);
  return (
    <div className="discover-content-item">
      <img src={imgSrc} className="discover-content-item-cover" alt="image" />
      <div className="discover-content-item-info">
        <div className="discover-content-item-description">{description}</div>
        <div className="discover-content-item-article-info">
          <div className="discover-content-item-article-author">
            <img src={avatarSrc} className="discover-content-item-article-author-avatar" alt="avatar" />
            <div className="discover-content-item-article-author-name">{name}</div>
          </div>
          <div className="discover-content-item-author-like">
            <FavoriteBorder className="discover-content-item-author-like-icon" />
            <div className="discover-content-item-author-like-number">{likeNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PlanItem };
