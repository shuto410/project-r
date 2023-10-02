import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import styled from 'styled-components';
import { setFloor } from './store/features/map';
import { switchScene } from './store/features/scene';
import { Button, Card, Progress } from 'react-daisyui';
import { reduceEnemyHp } from './store/features/battle';

//https://note.com/tabelog_frontend/n/n2541778b81e3
const Backdrop = styled.div`
  position: absolute;
  height: 750px;
  width: 1000px;
`;
function App() {
  const floorKey = useSelector((state: RootState) => state.map.floorKey);
  const scene = useSelector((state: RootState) => state.scene.value);
  const enemies = useSelector((state: RootState) => state.battle.enemies);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const enemy = enemies?.[0];
  const enemyInfoElement = (
    // <div className="w-1/3">
    <Card className="w-1/3 bg-slate-200">
      <Card.Body className="hogebg-slate-200">
        <Card.Title tag="h2">{enemies?.[0]?.name}</Card.Title>
        <Progress
          // className="w-1/6"
          max={enemy?.status?.maxHp}
          value={enemy?.status?.hp}
        />
      </Card.Body>
    </Card>
    // </div>
  );

  return (
    <Backdrop>
      <div className="text-bg">Floor: {floorKey}</div>
      <Button onClick={() => dispatch(setFloor('1'))}>1</Button>
      <Button onClick={() => dispatch(setFloor('2'))}>2</Button>
      <Button onClick={() => dispatch(setFloor('3'))}>3</Button>
      <Button onClick={() => dispatch(switchScene('map'))}>map</Button>
      <Button onClick={() => dispatch(switchScene('battle'))}>battle</Button>
      <Button onClick={() => console.debug(state)}>state</Button>
      {scene === 'battle' && enemyInfoElement}
      <Button onClick={() => dispatch(reduceEnemyHp({ id: 0, amount: 10 }))}>
        attack
      </Button>
    </Backdrop>
  );
}

export default App;
