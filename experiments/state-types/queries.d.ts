import * as M from "./methods";
import { Utilities } from "./utilities";

export type Root = Select &
  Values &
  Insert &
  Update &
  Delete &
  Manual &
  Utilities;

export interface Builder extends Root {}

export interface Select
  extends M.Extend<Select>,
    M.Express<Select>,
    M.With<Select>,
    M.From<Select>,
    M.Return<Select>,
    M.Where<Select>,
    M.Order<Select>,
    M.Limit<Select>,
    M.Offset<Select>,
    M.Group<Select>,
    M.Having<Select> {}

export interface Values
  extends M.Extend<Values>,
    M.Order<Values>,
    M.Limit<Values>,
    M.Offset<Values>,
    M.Values<Values> {}

export interface Insert
  extends M.Extend<Insert>,
    M.Express<Insert>,
    M.With<Insert>,
    M.From<Insert>,
    M.Return<Insert>,
    M.Insert<Insert> {}

export interface Update
  extends M.Extend<Update>,
    M.Express<Update>,
    M.With<Update>,
    M.From<Update>,
    M.Return<Update>,
    M.Where<Update>,
    M.Set<Update> {}

export interface Delete
  extends M.Extend<Delete>,
    M.Express<Delete>,
    M.With<Delete>,
    M.From<Delete>,
    M.Return<Delete>,
    M.Where<Delete>,
    M.Delete<Delete> {}

export interface Manual
  extends M.Extend<Manual>,
    M.SQL<Manual>,
    M.Raw<Manual> {}
