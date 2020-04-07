import * as React from 'react';
import { IEvtEmit } from '@/EventCollect';
import { calResizeHandler } from '@/lib/util';
import { style } from './style';
import { Context } from '../provider';

interface IHandlerProps {
  evtEmit: IEvtEmit;
  x: number;
  y: number;
  rotate: number;
  origin: [number, number];
  type: IGrag.IResizeType;
}

export function ResizeLayer(props: { canvasId: string; }) {
  const { useMappedCanvasState, globalStore, evtEmit } = React.useContext(Context);
  const { selectedFtrs, isMoving, resizeType, border } = useMappedCanvasState((s) => ({
    selectedFtrs: s.selectedFtrs, isMoving: s.isMoving,
    resizeType: s.resizeType, border: s.border
  }));

  if (!selectedFtrs.length || !border) {
    return null;
  }

  const noInCanvas = selectedFtrs.some(
    (ftrId) => globalStore.getCanvasIdByFtrId(ftrId) !== props.canvasId
  );
  if (noInCanvas) {
    return null;
  }

  return (
    <div style={style}>
      <Border box={border} />
      {
        isMoving ? null : calResizeHandler(border, 4).map((p) => {
          if(resizeType && resizeType !== p.type) {
            return null;
          }
          return <Handler key={p.type} evtEmit={evtEmit} rotate={border.rotate} {...p} />;
        })
      }
    </div>
  );
}

function Border(props: { box: IGrag.IStyle; }) {
  const { box } = props;
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    width: box.width + 2,
    height: box.height + 2,
    left: box.x - 1,
    top: box.y - 1,
    backgroundColor: 'rgba(0,0,0,0)',
    border: '1px solid #d8d8d8',
    transform: `rotate(${box.rotate}deg)`
  };
  return <div style={style} />;
}

function Handler(props: IHandlerProps) {
  const { x, y, rotate, origin, type, evtEmit } = props;
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 5px #b9b9b9',
    cursor: `${type}-resize`,
    top: y,
    left: x,
    transform: `rotate(${rotate}deg)`,
    transformOrigin: `${origin[0]}px ${origin[1]}px`
  };

  const handleMousedown = React.useCallback((e: React.MouseEvent) => {
    evtEmit('resizeMousedown', type);
    e.stopPropagation();
  }, [type]);

  const handleMouseup = React.useCallback((e: React.MouseEvent) => {
    evtEmit('resizeMouseup');
    e.stopPropagation();
  }, [type]);

  return <div onMouseDown={handleMousedown} onMouseUp={handleMouseup} style={style} />;
}
