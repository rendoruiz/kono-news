import { FluentLineHorizontal3Regular } from "./FluentIcons";

const NavigationToggle = ({ onClick }) => (
  <button
    type='button'
    title='navigation panel toggle button'
    className='border-1 rounded leading-none transition-opacity cursor-pointer hover:opacity-50'
    onClick={onClick}
  >
    <FluentLineHorizontal3Regular 
      className='w-5 h-5 group-active:scale-[0.8] origin-center transition-transform'
    />
  </button>
);
 
export default NavigationToggle;