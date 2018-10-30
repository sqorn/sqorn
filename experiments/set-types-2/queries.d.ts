import * as M from "./methods";
import { Utilities } from "./utilities";
import * as S from './states'

export interface Select<T>
  extends M.Extend<T>,
    // M.Express<T>,
    M.With<T>,
    M.From<T>,
    M.Return<T>,
    M.Where<T>,
    M.Order<T>,
    M.Limit<T>,
    M.Offset<T>,
    M.Group<T>,
    M.Having<T> {}

export interface Update<T>
  extends M.Extend<T>,
    // M.Express<T>,
    M.With<T>,
    M.From<T>,
    M.Return<T>,
    M.Where<T>,
    M.Set<T> {}
  
export interface Delete<T>
  extends M.Extend<T>,
    // M.Express<T>,
    M.With<T>,
    M.From<T>,
    M.Return<T>,
    M.Where<T>,
    M.Delete<T> {}

export interface Insert<T>
  extends M.Extend<T>,
    // M.Express<T>,
    M.With<T>,
    M.From<T>,
    M.Return<T>,
    M.Insert<T> {}

export interface Values<T>
  extends M.Extend<T>,
    M.Order<T>,
    M.Limit<T>,
    M.Offset<T>,
    M.Values<T> {}

export interface Manual<T>
  extends M.Extend<T>,
    M.SQL<T>,
    M.Raw<T> {}
