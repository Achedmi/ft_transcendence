interface IconProps {
  fillColor?: string;
  size?: number | string;
  className?: string;
}
export const Profile = (icon: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={icon.size} height={icon.size} stroke='none' viewBox='0 0 24 24' className={icon.className}>
      <g>
        <g>
          <g fillRule='evenodd' clipRule='evenodd'>
            <path d='M6.75 6.5a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z'></path>
            <path d='M4.25 18.571a5.321 5.321 0 015.321-5.321h4.858a5.321 5.321 0 015.321 5.321 4.179 4.179 0 01-4.179 4.179H8.43a4.179 4.179 0 01-4.179-4.179z'></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const Settings = (icon: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={icon.size} height={icon.size} fill='#433650' viewBox='0 0 36 36'>
      <path
        fill={icon.fillColor}
        fillRule='evenodd'
        d='M21.418 3.228C20.863 3 20.158 3 18.75 3c-1.409 0-2.113 0-2.668.228-.74.305-1.33.889-1.636 1.624-.14.336-.195.726-.216 1.295-.032.837-.464 1.61-1.195 2.03-.73.418-1.622.402-2.368.011-.507-.266-.875-.414-1.238-.461a3.04 3.04 0 00-2.235.594c-.477.363-.829.968-1.533 2.179-.704 1.21-1.056 1.816-1.135 2.407-.105.79.11 1.587.599 2.218.223.288.536.53 1.022.834.714.445 1.173 1.204 1.173 2.041s-.46 1.596-1.173 2.041c-.486.303-.8.546-1.022.834a2.983 2.983 0 00-.6 2.218c.08.591.431 1.197 1.136 2.407.704 1.21 1.056 1.816 1.533 2.18a3.04 3.04 0 002.235.593c.363-.047.73-.195 1.238-.461.746-.391 1.638-.407 2.368.011.73.42 1.163 1.194 1.194 2.03.022.57.077.96.217 1.295.307.735.895 1.32 1.636 1.624.555.228 1.26.228 2.668.228 1.409 0 2.113 0 2.668-.228a3.012 3.012 0 001.636-1.624c.14-.335.195-.726.216-1.295.032-.837.464-1.61 1.195-2.03.73-.418 1.622-.402 2.368-.011.507.266.875.414 1.238.461a3.04 3.04 0 002.235-.594c.477-.363.829-.968 1.533-2.18.704-1.21 1.056-1.815 1.135-2.406a2.984 2.984 0 00-.599-2.218c-.223-.288-.536-.53-1.022-.834-.714-.445-1.174-1.204-1.174-2.041s.46-1.596 1.174-2.041c.486-.303.8-.545 1.022-.834a2.985 2.985 0 00.6-2.217c-.08-.592-.431-1.197-1.136-2.408-.704-1.21-1.056-1.816-1.533-2.18a3.04 3.04 0 00-2.235-.593c-.363.047-.73.195-1.238.461-.746.391-1.638.407-2.368-.012-.73-.418-1.163-1.193-1.195-2.03-.021-.568-.076-.958-.216-1.294a3.011 3.011 0 00-1.636-1.624zM18.75 22.5c2.504 0 4.534-2.015 4.534-4.5s-2.03-4.5-4.534-4.5-4.534 2.015-4.534 4.5 2.03 4.5 4.534 4.5z'
        clipRule='evenodd'
      ></path>
    </svg>
  );
};

export const Logout = (icon: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={icon.size} height={icon.size} fill='#433650' viewBox='0 0 32 32' className={icon.className}>
      <path
        d='M25.23 14.5H9.225a1.5 1.5 0 000 3h16.038l-3.114 3.114a1.501 1.501 0 002.122 2.121l4.242-4.242a3.5 3.5 0 000-4.95L24.272 9.3a1.502 1.502 0 00-2.122 0 1.502 1.502 0 000 2.122l3.08 3.078z'
        clipRule='evenodd'
      ></path>
      <path
        d='M20 24v-4.5H9.226a3.501 3.501 0 01-3.5-3.5c0-1.932 1.568-3.5 3.5-3.5H20V8a5 5 0 00-5-5H8a5.004 5.004 0 00-3.536 1.464A5.004 5.004 0 003 8v16c0 1.326.527 2.598 1.464 3.536A5.004 5.004 0 008 29h7a5.004 5.004 0 003.536-1.464A5.004 5.004 0 0020 24z'
        clipRule='evenodd'
      ></path>
    </svg>
  );
};

export const Edit = (icon: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={icon.size} height={icon.size} fill='none' viewBox='0 0 38 38'>
      <path
        stroke={icon.fillColor}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='4'
        d='M19 6.333H9.5A3.167 3.167 0 006.333 9.5v19A3.167 3.167 0 009.5 31.667h19a3.167 3.167 0 003.167-3.167V19m-2.511-5.678l1.72-1.719a3.167 3.167 0 00-4.48-4.478l-1.718 1.72m4.478 4.477l-9.557 9.558a3.167 3.167 0 01-1.619.866l-4.657.931.931-4.657a3.167 3.167 0 01.866-1.618l9.558-9.558m4.478 4.478l-4.478-4.478'
      ></path>
    </svg>
  );
};

export const Close = (icon: IconProps) => {
  return (
    <svg width={icon.size} height={icon.size} viewBox='0 0 58 58' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M28.9998 0.666504C13.3882 0.666504 0.666504 13.3882 0.666504 28.9998C0.666504 44.6115 13.3882 57.3332 28.9998 57.3332C44.6115 57.3332 57.3332 44.6115 57.3332 28.9998C57.3332 13.3882 44.6115 0.666504 28.9998 0.666504ZM38.5198 35.5165C39.3415 36.3382 39.3415 37.6982 38.5198 38.5198C38.0948 38.9448 37.5565 39.1432 37.0182 39.1432C36.4798 39.1432 35.9415 38.9448 35.5165 38.5198L28.9998 32.0032L22.4832 38.5198C22.0582 38.9448 21.5198 39.1432 20.9815 39.1432C20.4432 39.1432 19.9048 38.9448 19.4798 38.5198C18.6582 37.6982 18.6582 36.3382 19.4798 35.5165L25.9965 28.9998L19.4798 22.4832C18.6582 21.6615 18.6582 20.3015 19.4798 19.4798C20.3015 18.6582 21.6615 18.6582 22.4832 19.4798L28.9998 25.9965L35.5165 19.4798C36.3382 18.6582 37.6982 18.6582 38.5198 19.4798C39.3415 20.3015 39.3415 21.6615 38.5198 22.4832L32.0032 28.9998L38.5198 35.5165Z'
        fill={icon.fillColor}
      />
    </svg>
  );
};

export const Toggle = ({ on }: { on: any }) => {
  return (
    <div
      className={
        on
          ? 'relative bg h-4 w-9  bg-blue-cl rounded-full border-solid border-dark-cl border-2 hover:cursor-pointer'
          : 'relative bg h-4 w-9  bg-red-cl rounded-full border-solid border-dark-cl border-2 hover:cursor-pointer'
      }
    >
      <div
        className={
          on
            ? 'h-5 w-5 bg-white rounded-full relative border-solid border-dark-cl border-2 top-[50%] transform -translate-y-1/2 left-[80%] -translate-x-1/2'
            : 'h-5 w-5 bg-white rounded-full relative border-solid border-dark-cl border-2 top-[50%] transform -translate-y-1/2 left-[20%] -translate-x-1/2  '
        }
      ></div>
    </div>
  );
};

export const Tfa = (icon: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={icon.size} height={icon.size} fill='none' viewBox='0 0 50 50'>
      <g fill='#433650' clipPath='url(#clip0_497_178)'>
        <path d='M17.188 36.219l-3.125-3.127-2.205 2.203 5.33 5.33 9.375-9.375-2.203-2.203-7.172 7.172zM43.75 46.875H37.5V43.75h6.25V25H37.5V12.5a6.257 6.257 0 00-6.25-6.25V3.125a9.386 9.386 0 019.375 9.375v9.375h3.125A3.128 3.128 0 0146.875 25v18.75a3.128 3.128 0 01-3.125 3.125z'></path>
        <path d='M31.25 21.875h-3.125V12.5a9.375 9.375 0 10-18.75 0v9.375H6.25A3.125 3.125 0 003.125 25v18.75a3.125 3.125 0 003.125 3.125h25a3.125 3.125 0 003.125-3.125V25a3.125 3.125 0 00-3.125-3.125zM12.5 12.5a6.25 6.25 0 0112.5 0v9.375H12.5V12.5zm18.75 31.25h-25V25h25v18.75z'></path>
      </g>
      <defs>
        <clipPath id='clip0_497_178'>
          <path fill='#fff' d='M0 0H50V50H0z'></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export const Check = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
      <path
        fill='#67B9D3'
        fillRule='evenodd'
        d='M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-5.97-3.03a.75.75 0 010 1.06l-5 5a.75.75 0 01-1.06 0l-2-2a.75.75 0 111.06-1.06l1.47 1.47 2.235-2.236L14.97 8.97a.75.75 0 011.06 0z'
        clipRule='evenodd'
      ></path>
    </svg>
  );
};

export const Error = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
      <path
        fill='#C84D46'
        fillRule='evenodd'
        d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 00-.499.522l.306 7a.5.5 0 00.5.478h1.043a.5.5 0 00.5-.478l.305-7a.5.5 0 00-.5-.522h-1.655z'
        clipRule='evenodd'
      ></path>
    </svg>
  );
};
export const MessageIcon = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
      <path
        fill='#fff'
        fillRule='evenodd'
        d='M12 2C6.477 2 2 6.477 2 12c0 1.815.485 3.52 1.331 4.988.173.3.202.664.057.977l-.854 1.837A1.5 1.5 0 003.862 22H12c5.523 0 10-4.477 10-10S17.523 2 12 2zM8 13.3a1.3 1.3 0 100-2.6 1.3 1.3 0 000 2.6zm8 0a1.3 1.3 0 100-2.6 1.3 1.3 0 000 2.6zm-4 0a1.3 1.3 0 100-2.6 1.3 1.3 0 000 2.6z'
        clipRule='evenodd'
      ></path>
    </svg>
  );
};

export function UnfriendIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='23' height='23' fill='none' viewBox='0 0 23 23'>
      <path
        fill='#fff'
        d='M21.682 13.754a4.53 4.53 0 00-2.802-1.319 4.458 4.458 0 001.486-3.325 4.476 4.476 0 00-8.942-.328A5.928 5.928 0 0115 14.217c0 .888-.202 1.756-.578 2.544a5.97 5.97 0 011.475 1.087 6.018 6.018 0 011.737 4.257l-.001.033-.001.027-.04.749h5.363L23 16.983a4.528 4.528 0 00-1.318-3.229z'
      ></path>
      <path
        fill='#fff'
        d='M12.072 17.543a4.46 4.46 0 001.487-3.325 4.478 4.478 0 10-8.956 0 4.46 4.46 0 001.484 3.322 4.53 4.53 0 00-4.184 4.483l-.045.89h14.29l.044-.824a4.532 4.532 0 00-4.12-4.546z'
      ></path>
      <path stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6.746 5.06H3.373M5.06 8.855a3.795 3.795 0 100-7.59 3.795 3.795 0 000 7.59z'></path>
    </svg>
  );
}

export const Search = (icon: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' width={icon.size} height={icon.size} className={icon.className}>
      <path stroke='#433650' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.796 15.811L21 21m-3-10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z'></path>
    </svg>
  );
};

export const Home = (icon: IconProps) => {
  return (
    <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' className={icon.className}>
      <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
      <g id='SVGRepo_iconCarrier'>
        {' '}
        <path
          clipRule='evenodd'
          d='M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z'
        ></path>{' '}
      </g>
    </svg>
  );
};

export const Game = (icon: IconProps) => {
  return (
    <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' className={icon.className}>
      <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
      <g id='SVGRepo_iconCarrier'>
        <path d='M15.5,8H13V4a1,1,0,0,0-2,0V8H8.773A6.681,6.681,0,0,0,2,14.3,6.5,6.5,0,0,0,8.5,21H9V20a3,3,0,0,1,6,0v1h.227A6.681,6.681,0,0,0,22,14.7,6.5,6.5,0,0,0,15.5,8ZM10,14.5H9v1a1,1,0,0,1-2,0v-1H6a1,1,0,0,1,0-2H7v-1a1,1,0,0,1,2,0v1h1a1,1,0,0,1,0,2ZM16,16a1,1,0,1,1,1-1A1,1,0,0,1,16,16Zm2-3a1,1,0,1,1,1-1A1,1,0,0,1,18,13Z'></path>
      </g>
    </svg>
  );
};





//   <label for='states' class='sr-only'>
//     Choose a state
//   </label>
//   <select
//     id='states'
//     class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 dark:border-s-gray-700 border-s-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
//   >
//     <option selected>Choose a state</option>
//     <option value='CA'>California</option>
//     <option value='TX'>Texas</option>
//     <option value='WH'>Washinghton</option>
//     <option value='FL'>Florida</option>
//     <option value='VG'>Virginia</option>
//     <option value='GE'>Georgia</option>
//     <option value='MI'>Michigan</option>
//   </select>
// </div>;
