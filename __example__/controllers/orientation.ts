import { OrientationManager, SharedState } from '@huds0n/expo';

type OrientationStateType = {
  orientationLock: OrientationManager.Orientation;
};

const OrientationState = new SharedState<OrientationStateType>({
  orientationLock: 'DEFAULT',
});

export function getOrientationLock() {
  return OrientationState.state.orientationLock;
}

export function setOrientationLock(
  orientationLock: OrientationManager.Orientation,
) {
  OrientationState.setState({ orientationLock });

  OrientationManager.lock('GLOBAL_LOCK', orientationLock);
}

export const useOrientationLock = OrientationManager.useLock;
