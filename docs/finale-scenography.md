# Road and infernal destination update

The road now uses a locally generated repeating asphalt texture and subtle bump
mapping, aggregate, repaired cracks and tire wear. The inconsistent dashed stripe
through the middle of the vehicle's lane was removed. Edge markings and shoulders
remain aligned to the existing curved road. This also removes 110 ribbon meshes.

The last stretch adds two broad lava rivers outside the asphalt, 28 instanced
volcanic crags and a layered incandescent surface behind the existing volumetric
portal. Shader detail follows journey progress; reverse scroll restores the same
state. No additional dynamic lights, shadow maps, bloom or perpetual rendering
loop are introduced. The existing original vehicle remains unchanged.

A freestanding photo panel stands 22 world units before the gate, outside the
roadway. Photo: ACDC In Tacoma 2009.jpg, Imhavingfun42, CC BY-SA 3.0.
Source and license verified on Wikimedia Commons:
https://commons.wikimedia.org/wiki/File:ACDC_In_Tacoma_2009.jpg
https://creativecommons.org/licenses/by-sa/3.0/
Image URL: https://upload.wikimedia.org/wikipedia/commons/9/9e/ACDC_In_Tacoma_2009.jpg
The photograph is displayed uncropped at its original 600:473 aspect ratio.
Its source, author and license appear in the Credits dialog. This environment's
HTTP destination policy blocks downloading Wikimedia assets, so the original
photograph loads directly from Wikimedia in the visitor's browser. An isolated asynchronous loader handles errors without throwing into the
scene and offers a link to the original photo if it fails. Offline access or a blocked Wikimedia domain prevents the photo loading.

The persistent vehicle provenance plate and manual high/low visual selector have
been removed. Required model attribution remains in the unobtrusive Credits
dialog. Quality is selected automatically from the initial viewport size.

Validation: production build and existing journey/finale tests pass. Desktop and
mobile scenes rendered in SwiftShader; no shader compilation errors. Credits
open correctly; the provenance plate and visual selector are absent. Reverse
scroll works. Wikimedia photo loading is blocked in this environment and could
not be visually verified here. Mobile arrival framing was widened to show more
of the portal surroundings.
