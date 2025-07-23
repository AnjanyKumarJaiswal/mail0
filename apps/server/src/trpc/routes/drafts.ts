import type { MailManager } from '../../lib/driver/types';
import { activeDriverProcedure, router } from '../trpc';
import { getZeroAgent } from '../../lib/server-utils';
import { createDraftData } from '../../lib/schemas';
import { z } from 'zod';

export const draftsRouter = router({
  create: activeDriverProcedure.input(createDraftData).mutation(async ({ input, ctx }) => {
    const { activeConnection } = ctx;
    const agent = await getZeroAgent(activeConnection.id);
    return agent.createDraft(input);
  }),
  update: activeDriverProcedure
    .input(createDraftData)
    .mutation(async ({input, ctx}) =>{
      const {activeConnection} = ctx;
      const agent = await getZeroAgent(activeConnection.id);
      const res = await agent.updateDraft(input);
      return res;
    }),
  delete: activeDriverProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { activeConnection } = ctx;
      const agent = await getZeroAgent(activeConnection.id);
      return agent.deleteDraft(input.id);
    }),
  get: activeDriverProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { activeConnection } = ctx;
    const agent = await getZeroAgent(activeConnection.id);
    const { id } = input;
    const res = await agent.getDraft(id) as Awaited<ReturnType<MailManager['getDraft']>>
    return res;
  }),
  list: activeDriverProcedure
    .input(
      z.object({
        q: z.string().optional(),
        maxResults: z.number().optional(),
        pageToken: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { activeConnection } = ctx;
      const agent = await getZeroAgent(activeConnection.id);
      const { q, maxResults, pageToken } = input;
      const res = agent.listDrafts({ q, maxResults: maxResults, pageToken }) as Awaited<ReturnType<MailManager['listDrafts']>>;
      return res;
    }),
});
