import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { decrement, increment } from './store/features/counter';
import styled from 'styled-components';

//https://note.com/tabelog_frontend/n/n2541778b81e3
const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;
function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <Backdrop>
      <div>count: {count}</div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increment())}>+</button>
    </Backdrop>
  );
}

export default App;
