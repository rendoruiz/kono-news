import { FluentLineHorizontal3Regular } from "./FluentIcons";

const NavigationToggle = ({ onClick }) => (
  <button
    type='button'
    title='navigation panel toggle button'
    className='group border-1 border-transparent rounded ml-1 px-2 py-1 leading-none transition-opacity cursor-pointer hover:opacity-50'
    onClick={onClick}
  >
    <FluentLineHorizontal3Regular 
      className='w-7 h-7 group-active:scale-[0.8] origin-center transition-transform'
    />
  </button>
);
 
export default NavigationToggle;