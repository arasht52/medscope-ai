import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { approvedPathologyQuizImages } from "../src/shared/lib/pathologyQuizImages.js";
import { buildImageIdentificationQuiz, isApprovedQuizImage } from "../src/shared/lib/imageQuiz.js";

// Reviewed pre-rename byte and rights/caption fingerprints, independent of HEAD.
const expected = {
  "/images/pathology/pathology-img-001.jpg": {
    "sha256": "5c4855296fa36ac91771abc02c50b917932f07ce869965812bc866786acfd4d6",
    "metadataSha256": "a2230115e63b272b6f9f592fe081cc2b600a306d084e9585f603637aae863ddb",
    "topicId": "alzheimer-disease"
  },
  "/images/pathology/pathology-img-002.jpg": {
    "sha256": "076151fae29ff39f102fb6eb02fb89a72e03ff30a35eef36cac0fbc3fe189d38",
    "metadataSha256": "7f2b1d4dacce8ebc980323d549269cdb12d6be968320cedd5b25cc095617404c",
    "topicId": "astrocytoma-glioblastoma"
  },
  "/images/pathology/pathology-img-003.jpg": {
    "sha256": "219e5c1136384b7360999b5ff58be0a601964944a0369473df8deaf9b096f2d7",
    "metadataSha256": "49985530f5f26a467a8265f74502506b171b9589d4f1cb0ece49087086556172",
    "topicId": "burkitt-lymphoma"
  },
  "/images/pathology/pathology-img-004.jpg": {
    "sha256": "9329823f5153b7238f90d755054f5983e0d955bbf46ba5b0f248e39b48a99bac",
    "metadataSha256": "f44767ae5eb525c0f710e3d7a22e87c68236706920a67104a3671079ebd558d2",
    "topicId": "cholangiocarcinoma"
  },
  "/images/pathology/pathology-img-005.jpg": {
    "sha256": "0c0dca8fac429b6dd7e5234ddffdea3804b8b4b1009c217d79c467a90855f518",
    "metadataSha256": "2605ecb40f00a1158d3f472387ed35c96982e5e634eaedf7c55363f862d1671d",
    "topicId": "chronic-lymphocytic-leukemia"
  },
  "/images/pathology/pathology-img-006.jpg": {
    "sha256": "e16483c8b0bb723d34d07c164fce823c2a09c1d2cfc823d43ee877dc29ef26da",
    "metadataSha256": "b2a607d0f0e1dfaf7a0ab805f4ff33b032ea27eb54823c9b2bc577d32364eab9",
    "topicId": "cirrhosis-of-liver"
  },
  "/images/pathology/pathology-img-007.jpg": {
    "sha256": "b88bbc03844b8d9517f121fe80953f7cf04e6b78569d1769c5356b17969096b6",
    "metadataSha256": "de74986ff16fd2065e9c08ad5ae000fdccb7defcf6687c9380a07bafc7668458",
    "topicId": "colorectal-adenocarcinoma-polyps"
  },
  "/images/pathology/pathology-img-008.jpg": {
    "sha256": "86a861cc13c437cb366c34aab8d6f44e4deaa7b333b62de7758154403ce52f8c",
    "metadataSha256": "09c07665cee7be4a9336e816094bc8477c027825dfadb19655e842f91604a6ae",
    "topicId": "copd-emphysema-chronic-bronchitis"
  },
  "/images/pathology/pathology-img-009.jpg": {
    "sha256": "eeae114a0a08c954ad2900423a39cdf2d3eaa6f6476d870757ce8d7c8bf30900",
    "metadataSha256": "33f9f88c8257221a0d15c298ee1d85ab7549d33fe4cd8ec7a9309c63959bacc1",
    "topicId": "ependymoma"
  },
  "/images/pathology/pathology-img-010.jpg": {
    "sha256": "bf82a340c15eacc69a711f44d18c84f24547304666e4a7f1d81208eb268c2190",
    "metadataSha256": "c2fb627a1422fc8b0928d0ff9cf06e4a808fe2ebf9657687d75fe35c9be6bff3",
    "topicId": "ewing-sarcoma"
  },
  "/images/pathology/pathology-img-011.jpg": {
    "sha256": "f25631c3ef12adb4c2141e6215cafb1c04af0e6bff002cbf03500e117f517292",
    "metadataSha256": "0bba6ebf18bbdc9451a3239c6e576061142c3d63b9a99274951a4938f184f0d5",
    "topicId": "follicular-lymphoma"
  },
  "/images/pathology/pathology-img-012.jpg": {
    "sha256": "376a933dd5d26da6b3dc8179052fb89f138df8286f48116ea56022bba155c87b",
    "metadataSha256": "d146ae030b696cc5ba5565b7af801f50f58044319941773d5b184407124a3572",
    "topicId": "gastric-carcinoma"
  },
  "/images/pathology/pathology-img-013.jpg": {
    "sha256": "3ba236c7110c791dc66e067392119510362b1d8caf1317363d92d2a4a7f7329f",
    "metadataSha256": "8597a5144701838d1754af8d6b067d602f6e1529712df0cf8bcf9227d7f7d9b7",
    "topicId": "gastritis-acute-chronic"
  },
  "/images/pathology/pathology-img-014.jpg": {
    "sha256": "6edfa7cf59e3180b3e0f43cc0dcb57430d5b9f02b0044cd2f7225092fd94661e",
    "metadataSha256": "1c23ac0354eda964a26412612bf7685bf36779de340515445217a323417f60ca",
    "topicId": "gestational-trophoblastic-disease"
  },
  "/images/pathology/pathology-img-015.jpg": {
    "sha256": "c7bbb93ea58ed04372c7f8afe15d6c4fcba27437125a55cb4232fd0368084868",
    "metadataSha256": "7d6fc925fa4b2df9fef4b1797a0c0feaf3d3cbaaa233b01aedd027da4da8e8c6",
    "topicId": "graves-disease"
  },
  "/images/pathology/pathology-img-016.jpg": {
    "sha256": "87a5ce4bf998df9200fbc8161a401ee68cffcabc0ecc813cfae5fb2b039ee87e",
    "metadataSha256": "2a38f6413d7de8a4f1c4bca4f6a4483180dedbb57640c1904492ac975235962f",
    "topicId": "hairy-cell-leukemia"
  },
  "/images/pathology/pathology-img-017.jpg": {
    "sha256": "052dd6a5d9af97317270f95a4d56130c5ec9484b1f052d0499e25463f6eecb0e",
    "metadataSha256": "fb2bd22f3e005bcf390bf38d6fb4a25205f6f66fb42f67f1b8d48f97450ab3da",
    "topicId": "hashimoto-thyroiditis"
  },
  "/images/pathology/pathology-img-018.jpg": {
    "sha256": "1e3c919e85f9d97b236d86b270f8b3df2a5bae8f41efaa8cfd3d2c52e9713a7d",
    "metadataSha256": "66a10fa736cb11eb27600707eef20f1f8a96580a647dac3ceccb75e2ca4f054a",
    "topicId": "medulloblastoma"
  },
  "/images/pathology/pathology-img-019.jpg": {
    "sha256": "6f732052b2b86f3be3cb5340e385d6003ffcff74726ce1c41457364d8075a10d",
    "metadataSha256": "9fa908ac02af304ea3a4020e98f076510b3bb5e9d7d87ec224c90eaa98b7a5bd",
    "topicId": "meningioma"
  },
  "/images/pathology/pathology-img-020.jpg": {
    "sha256": "3f6f685a76b4b5d87fd0d64f6a321aab586f34af4fa2a2d3facf7691faffd0e8",
    "metadataSha256": "f2ed059f063f9bdd041d6102431236589add2bb2aeb8b2970e8af55477752151",
    "topicId": "multiple-myeloma"
  },
  "/images/pathology/pathology-img-021.jpg": {
    "sha256": "c23486a60713ee7db9cc1a43fa57cb188b16706adfc351679773df9c8c322669",
    "metadataSha256": "2e9e125c2bc32fc28d6c351eced9b4a81606c3cda186defe722586dd3afc87c5",
    "topicId": "oligodendroglioma"
  },
  "/images/pathology/pathology-img-022.jpg": {
    "sha256": "26c073f9d6775b9333aff7df4b9a84479e9cd090a8081340731c90f77deb4db5",
    "metadataSha256": "c211f84616cc907796fd34eec7b08d14d95ddba8a2049a7ec580db29b73bd1c7",
    "topicId": "osteosarcoma"
  },
  "/images/pathology/pathology-img-023.jpg": {
    "sha256": "4fe2f0c8f907da1c76927ba5683dc9c4be59a810d8deff3e2aa8f40b3ea19d91",
    "metadataSha256": "6d3e4d090df6e6d3bcf684e74219a9ba58c70d5d6baef6368493c1896d3c590a",
    "topicId": "parkinson-disease"
  },
  "/images/pathology/pathology-img-024.jpg": {
    "sha256": "5ce7ca791648638c52e24c7e69a2ff615856e18df233ce5ac48b3826758079a1",
    "metadataSha256": "708bd5e680459130caa8c3c128a24d2c7a52558d5f0508fc8ddfdd81c6c2a5f6",
    "topicId": "pheochromocytoma"
  },
  "/images/pathology/pathology-img-025.jpg": {
    "sha256": "b5822693e8887f70793e92a298563f3330e21d4098aa613669b015963ab1629f",
    "metadataSha256": "33235e1720df6f4f48891ea8426344f84caccf11663e98be535a9022d3f1a7c6",
    "topicId": "prostatic-adenocarcinoma"
  },
  "/images/pathology/pathology-img-026.jpg": {
    "sha256": "fdc1ec3b200ddda94d6f87decd3a3b75fe9b134118548b9999c89d6c5fe75c5a",
    "metadataSha256": "4f563ab6e85904757c543d2f4bba6edb033d11f3d2d85ca11d23baf82f182c1a",
    "topicId": "pulmonary-tuberculosis"
  },
  "/images/pathology/pathology-img-027.jpg": {
    "sha256": "e23e586aac72e08636ac087f74a3e2e163817cfc1947276a6be7cbedcd2457ef",
    "metadataSha256": "e077844742a0524683eefed1b08b36c39f4009d63bb89c3e78ebad442f7a17f9",
    "topicId": "reflux-esophagitis-barrett"
  },
  "/images/pathology/pathology-img-028.jpg": {
    "sha256": "b5a3c508acd0c69f63d791db836876cc221367581db1469abcb019fd1d70c91f",
    "metadataSha256": "c12018846d5882fc8d661b35af7fbf07ff6b15ae6eb924f4b7eb1e97feceb74e",
    "topicId": "renal-cell-carcinoma"
  },
  "/images/pathology/pathology-img-029.jpg": {
    "sha256": "1ee56c94bf523aab064a0f1a1a6b5d5e2bd28b0d436e4b48d8261ed57223dc69",
    "metadataSha256": "58c9b7b37fc72843466ef07387b17feaf9febd76f34ce6aa3de7bb07eb4de2e1",
    "topicId": "seminoma-embryonal-carcinoma"
  },
  "/images/pathology/pathology-img-030.jpg": {
    "sha256": "7aecbe35f737f038499876daf364938af036023bdbc4b5ee79362023d9becde7",
    "metadataSha256": "23c913b9e6a6f2f43fb00aec37e48d9f55121d8257a88e4857e3adcad3a20e5b",
    "topicId": "wilms-tumor"
  }
};
const data = JSON.parse(readFileSync("src/data/pathology.json", "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])) : value;

test("all 30 neutral JPEG assets retain exact reviewed bytes, topics, attribution and captions", () => {
  assert.deepEqual([...approvedPathologyQuizImages].sort(), Object.keys(expected).sort());
  assert.equal(approvedPathologyQuizImages.length, 30);
  for (const [url, original] of Object.entries(expected)) {
    assert.match(url, /^\/images\/pathology\/pathology-img-\d{3}\.jpg$/);
    assert.equal(sha(readFileSync("public" + url)), original.sha256);
    const item = data.items.find(item=>item.id===original.topicId);
    assert.equal(item.image.url,url);
    const {url: ignored, ...metadata}=item.image;
    assert.equal(sha(JSON.stringify(canonical(metadata))),original.metadataSha256);
    assert(isApprovedQuizImage(item.image,approvedPathologyQuizImages));
  }
});

test("generated image questions expose only neutral local filenames and preserve post-answer identity", () => {
  const questions=buildImageIdentificationQuiz(data.items,{count:100,idPrefix:"neutral",questionText:"تصویر",approvedImageUrls:approvedPathologyQuizImages});
  assert.equal(questions.length,30);
  for(const q of questions){
    assert.match(q.image.url,/^\/images\/pathology\/pathology-img-\d{3}\.jpg$/);
    assert.equal(q.image_url,q.image.url);
    const item=data.items.find(i=>i.image?.url===q.image.url);
    assert.equal(q.image.alt,item.image.alt);
    assert.deepEqual(q.image.rightsCredit,item.image.rightsCredit);
    assert(q.explanation_fa.includes(item.title_fa));
    assert.equal(q.options.find(o=>o.id===q.correctOptionId).text_en,item.title_en);
  }
});

test("nine excluded diagnostic JPEGs remain in source but outside the approved image pool", () => {
 const excluded=["celiac-disease","hodgkin-lymphoma","hepatocellular-carcinoma","bronchogenic-carcinoma","papillary-thyroid-carcinoma","iron-deficiency-anemia","pancreatic-ductal-adenocarcinoma","amyloidosis","acute-leukemia-aml-all"];
 for(const id of excluded){const url=`/images/pathology/${id}-photo.jpg`;assert(existsSync("public"+url));assert(!approvedPathologyQuizImages.includes(url));}
});
