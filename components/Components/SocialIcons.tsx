import {
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import SocialIcon from './SocialIcon';
import { useContext } from 'react';
import { PartialsContext } from '@/contexts/partials';
import { PartialsData } from '@/types/partials';

const SocialIcons = ({ className }: { className?: string }) => {
  const { social } = useContext(PartialsContext) as PartialsData;

  return (
    <ul className={`flex flex-wrap gap-6 ${className || ''}`}>
      {social.pinterest_url && (
        <li>
          <SocialIcon href={social.pinterest_url} title='Pinterest'>
            <FaPinterestP />
          </SocialIcon>
        </li>
      )}
      {social.instagram_url && (
        <li>
          <SocialIcon href={social.instagram_url} title='Instagram'>
            <FaInstagram />
          </SocialIcon>
        </li>
      )}
      {social.linkedin_url && (
        <li>
          <SocialIcon href={social.linkedin_url} title='LinkedIn'>
            <FaLinkedinIn />
          </SocialIcon>
        </li>
      )}
      {social.twitter_url && (
        <li>
          <SocialIcon href={social.twitter_url} title='Twitter'>
            <FaXTwitter />
          </SocialIcon>
        </li>
      )}
      {social.youtube_url && (
        <li>
          <SocialIcon href={social.youtube_url} title='Youtube'>
            <FaYoutube />
          </SocialIcon>
        </li>
      )}
    </ul>
  );
};

export default SocialIcons;
