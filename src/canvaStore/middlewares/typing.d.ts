// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { GlobalStore } from '@/GlobalStore';

declare global {
  namespace ITypeRedux {
    interface IContext<S, R extends IReducers<S>> {
      globalStore: GlobalStore;
    }
  }
}
