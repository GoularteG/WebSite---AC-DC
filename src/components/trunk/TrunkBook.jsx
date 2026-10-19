import MakingOf from '../book/MakingOf';
import { ObjectDialog } from './ObjectPanel';
export default function TrunkBook({reduced,onClose}) {
  return <ObjectDialog title="Livro The Making Of" onClose={onClose} book>
    <MakingOf reduced={reduced} embedded initialOpen onExit={onClose}/>
  </ObjectDialog>;
}
