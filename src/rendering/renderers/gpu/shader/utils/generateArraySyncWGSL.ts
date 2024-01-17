import { WGSL_ALIGN_SIZE_DATA } from './createUBOElementsWGSL';

import type { UBOElement } from '../../../shared/shader/types';

/**
 * This generates a function that will sync an array to the uniform buffer
 * following the wgsl layout
 * @param uboElement - the element to generate the array sync for
 * @param offsetToAdd - the offset to append at the start of the code
 * @returns - the generated code
 */
export function generateArraySyncWGSL(uboElement: UBOElement, offsetToAdd: number): string
{
    // this is in byte..
    const { size, align } = WGSL_ALIGN_SIZE_DATA[uboElement.data.type];

    const remainder = (size - align) / 4;

    return `
         v = uv.${uboElement.data.name};
         ${remainder !== 0 ? `offset += ${offsetToAdd};` : ''}

         let arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${uboElement.data.size * (size / 4)}; i++)
         {
             for(var j = 0; j < ${size / 4}; j++)
             {
                 data[arrayOffset++] = v[t++];
             }
             ${remainder !== 0 ? `arrayOffset += ${remainder};` : ''}
         }
     `;
}
