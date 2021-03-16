<style lang="scss">
.page-TKEEnv {
  #mindmap {
    height: 100%;
  }
}
</style>
<template>
  <div class="page page-TKEEnv">
    <mindmap v-model="data" :fitView="false" :download="false" :showUndo="false" :showNodeAdd="false"></mindmap>
  </div>
</template>
<script>
import mindmap from '@hellowuxin/mindmap'
export default {
  components: { mindmap },
  data: () => ({
    data: [
      {
        className: "App\\Services\\Order",
        id: "root",
        isroot: true,
        methodName: "receiptToBalance",
        name: "TransferService:receiptToBalance",
        children: [
          {
            className: "ReceiptService",
            id: "root_ReceiptService__receiptHandle",
            isroot: false,
            methodName: "_receiptHandle",
            nameSpace: "App\\Services\\Order",
            parentid: "root",
            name: "ReceiptService:_receiptHandle",
            children: [
              {
                className: "ReceiptService",
                id: "root_ReceiptService__receiptHandle_ReceiptService_receipt",
                isroot: false,
                methodName: "receipt",
                nameSpace: "App\\Services\\Order",
                parentid: "root_ReceiptService__receiptHandle",
                name: "ReceiptService:receipt",
                children: [
                  {
                    className: "WptController",
                    id: "root_ReceiptService__receiptHandle_ReceiptService_receipt_WptController_receiptAction",
                    isroot: false,
                    methodName: "receiptAction",
                    nameSpace: "App\\Http\\Inside\\V1_0\\Controllers",
                    parentid: "root_ReceiptService__receiptHandle_ReceiptService_receipt",
                    name: "WptController:receiptAction"
                  },
                  {
                    className: "BuyerAuctionLogic",
                    id: "root_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt",
                    isroot: false,
                    methodName: "receipt",
                    nameSpace: "App\\Logic",
                    parentid: "root_ReceiptService__receiptHandle_ReceiptService_receipt",
                    name: "BuyerAuctionLogic:receipt",
                    children: [
                      {
                        className: "BuyerAuctionController",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt_BuyerAuctionController_receiptLAction",
                        isroot: false,
                        methodName: "receiptLAction",
                        nameSpace: "App\\Http\\Wechat\\V1_0\\Controllers",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt",
                        name: "BuyerAuctionController:receiptLAction"
                      },
                    ]
                  },
                  {
                    className: "SaleCorpAddressCommand",
                    id: "root_ReceiptService__receiptHandle_ReceiptService_receipt_SaleCorpAddressCommand_handle",
                    isroot: false,
                    methodName: "handle",
                    nameSpace: "App\\Console\\Commands\\Business",
                    parentid: "root_ReceiptService__receiptHandle_ReceiptService_receipt",
                    name: "SaleCorpAddressCommand:handle"
                  },
                  {
                    className: "ReceiptTimeEndHandle",
                    id: "root_ReceiptService__receiptHandle_ReceiptService_receipt_ReceiptTimeEndHandle_receiptOneSale",
                    isroot: false,
                    methodName: "receiptOneSale",
                    nameSpace: "App\\Console\\Commands\\SaleRelated",
                    parentid: "root_ReceiptService__receiptHandle_ReceiptService_receipt",
                    name: "ReceiptTimeEndHandle:receiptOneSale",
                    children: [
                      {
                        className: "ReceiptTimeEndHandle",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_receipt_ReceiptTimeEndHandle_receiptOneSale_ReceiptTimeEndHandle_handle",
                        isroot: false,
                        methodName: "handle",
                        nameSpace: "App\\Console\\Commands\\SaleRelated",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_receipt_ReceiptTimeEndHandle_receiptOneSale",
                        name: "ReceiptTimeEndHandle:handle"
                      },
                    ]
                  },
                  {
                    className: "BuyerAuctionLogic",
                    id: "root_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt",
                    isroot: false,
                    methodName: "receipt",
                    nameSpace: "App\\Logic",
                    parentid: "root_ReceiptService__receiptHandle_ReceiptService_receipt",
                    name: "BuyerAuctionLogic:receipt",
                    children: [
                      {
                        className: "BuyerAuctionController",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt_BuyerAuctionController_receiptLAction",
                        isroot: false,
                        methodName: "receiptLAction",
                        nameSpace: "App\\Http\\Wechat\\V1_0\\Controllers",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt",
                        name: "BuyerAuctionController:receiptLAction"
                      },
                    ]
                  },
                ]
              },
              {
                className: "ReceiptService",
                id: "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney",
                isroot: false,
                methodName: "orderReceiptDealMoney",
                nameSpace: "App\\Services\\Order",
                parentid: "root_ReceiptService__receiptHandle",
                name: "ReceiptService:orderReceiptDealMoney",
                children: [
                  {
                    className: "ReceiptService",
                    id:
                      "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                    isroot: false,
                    methodName: "receiptV2",
                    nameSpace: "App\\Services\\Order",
                    parentid:
                      "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney",
                    name: "ReceiptService:receiptV2",
                    children: [
                      {
                        className: "WptController",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_WptController_receiptAction",
                        isroot: false,
                        methodName: "receiptAction",
                        nameSpace: "App\\Http\\Inside\\V1_0\\Controllers",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                        name: "WptController:receiptAction"
                      },
                      {
                        className: "BuyerAuctionLogic",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2",
                        isroot: false,
                        methodName: "receiptV2",
                        nameSpace: "App\\Logic",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                        name: "BuyerAuctionLogic:receiptV2",
                        children: [
                          {
                            className: "BuyerAuctionController",
                            id:
                              "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2_BuyerAuctionController_receiptLAction",
                            isroot: false,
                            methodName: "receiptLAction",
                            nameSpace: "App\\Http\\Wechat\\V1_0\\Controllers",
                            parentid:
                              "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2",
                            name: "BuyerAuctionController:receiptLAction"
                          },
                        ]
                      },
                      {
                        className: "SaleCorpAddressCommand",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_SaleCorpAddressCommand_handle",
                        isroot: false,
                        methodName: "handle",
                        nameSpace: "App\\Console\\Commands\\Business",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                        name: "SaleCorpAddressCommand:handle"
                      },
                      {
                        className: "ReceiptTimeEndHandle",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_ReceiptTimeEndHandle_receiptOneSale",
                        isroot: false,
                        methodName: "receiptOneSale",
                        nameSpace: "App\\Console\\Commands\\SaleRelated",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                        name: "ReceiptTimeEndHandle:receiptOneSale",
                        children: [
                          {
                            className: "ReceiptTimeEndHandle",
                            id:
                              "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_ReceiptTimeEndHandle_receiptOneSale_ReceiptTimeEndHandle_handle",
                            isroot: false,
                            methodName: "handle",
                            nameSpace: "App\\Console\\Commands\\SaleRelated",
                            parentid:
                              "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_ReceiptTimeEndHandle_receiptOneSale",
                            name: "ReceiptTimeEndHandle:handle"
                          },
                        ]
                      },
                      {
                        className: "BuyerAuctionLogic",
                        id:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2",
                        isroot: false,
                        methodName: "receiptV2",
                        nameSpace: "App\\Logic",
                        parentid:
                          "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                        name: "BuyerAuctionLogic:receiptV2",
                        children: [
                          {
                            className: "BuyerAuctionController",
                            id:
                              "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2_BuyerAuctionController_receiptLAction",
                            isroot: false,
                            methodName: "receiptLAction",
                            nameSpace: "App\\Http\\Wechat\\V1_0\\Controllers",
                            parentid:
                              "root_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2",
                            name: "BuyerAuctionController:receiptLAction"
                          },
                        ]
                      },
                    ]
                  }
                ]
              }
            ]
          },
          {
            left: true,
            className: "ReceiptService",
            id: "root_ReceiptService__supplyPrice",
            isroot: false,
            methodName: "_supplyPrice",
            nameSpace: "App\\Services\\Order",
            parentid: "root",
            name: "ReceiptService:_supplyPrice",
            children: [
              {
                className: "ReceiptService",
                id: "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle",
                isroot: false,
                methodName: "_receiptHandle",
                nameSpace: "App\\Services\\Order",
                parentid: "root_ReceiptService__supplyPrice",
                name: "ReceiptService:_receiptHandle",
                children: [
                  {
                    className: "ReceiptService",
                    id:
                      "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt",
                    isroot: false,
                    methodName: "receipt",
                    nameSpace: "App\\Services\\Order",
                    parentid:
                      "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle",
                    name: "ReceiptService:receipt",
                    children: [
                      {
                        className: "WptController",
                        id:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_WptController_receiptAction",
                        isroot: false,
                        methodName: "receiptAction",
                        nameSpace: "App\\Http\\Inside\\V1_0\\Controllers",
                        parentid:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt",
                        name: "WptController:receiptAction"
                      },
                      {
                        className: "BuyerAuctionLogic",
                        id:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt",
                        isroot: false,
                        methodName: "receipt",
                        nameSpace: "App\\Logic",
                        parentid:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt",
                        name: "BuyerAuctionLogic:receipt",
                        children: [
                          {
                            className: "BuyerAuctionController",
                            id:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt_BuyerAuctionController_receiptLAction",
                            isroot: false,
                            methodName: "receiptLAction",
                            nameSpace: "App\\Http\\Wechat\\V1_0\\Controllers",
                            parentid:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt",
                            name: "BuyerAuctionController:receiptLAction"
                          },
                        ]
                      },
                      {
                        className: "SaleCorpAddressCommand",
                        id:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_SaleCorpAddressCommand_handle",
                        isroot: false,
                        methodName: "handle",
                        nameSpace: "App\\Console\\Commands\\Business",
                        parentid:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt",
                        name: "SaleCorpAddressCommand:handle"
                      },
                      {
                        className: "ReceiptTimeEndHandle",
                        id:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_ReceiptTimeEndHandle_receiptOneSale",
                        isroot: false,
                        methodName: "receiptOneSale",
                        nameSpace: "App\\Console\\Commands\\SaleRelated",
                        parentid:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt",
                        name: "ReceiptTimeEndHandle:receiptOneSale",
                        children: [
                          {
                            className: "ReceiptTimeEndHandle",
                            id:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_ReceiptTimeEndHandle_receiptOneSale_ReceiptTimeEndHandle_handle",
                            isroot: false,
                            methodName: "handle",
                            nameSpace: "App\\Console\\Commands\\SaleRelated",
                            parentid:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_ReceiptTimeEndHandle_receiptOneSale",
                            name: "ReceiptTimeEndHandle:handle"
                          },
                        ]
                      },
                      {
                        className: "BuyerAuctionLogic",
                        id:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt_BuyerAuctionLogic_receipt",
                        isroot: false,
                        methodName: "receipt",
                        nameSpace: "App\\Logic",
                        parentid:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_receipt",
                        name: "BuyerAuctionLogic:receipt"
                      }
                    ]
                  },
                  {
                    className: "ReceiptService",
                    id:
                      "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney",
                    isroot: false,
                    methodName: "orderReceiptDealMoney",
                    nameSpace: "App\\Services\\Order",
                    parentid:
                      "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle",
                    name: "ReceiptService:orderReceiptDealMoney",
                    children: [
                      {
                        className: "ReceiptService",
                        id:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                        isroot: false,
                        methodName: "receiptV2",
                        nameSpace: "App\\Services\\Order",
                        parentid:
                          "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney",
                        name: "ReceiptService:receiptV2",
                        children: [
                          {
                            className: "WptController",
                            id:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_WptController_receiptAction",
                            isroot: false,
                            methodName: "receiptAction",
                            nameSpace: "App\\Http\\Inside\\V1_0\\Controllers",
                            parentid:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                            name: "WptController:receiptAction"
                          },
                          {
                            className: "BuyerAuctionLogic",
                            id:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2",
                            isroot: false,
                            methodName: "receiptV2",
                            nameSpace: "App\\Logic",
                            parentid:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                            name: "BuyerAuctionLogic:receiptV2",
                            children: [
                              {
                                className: "BuyerAuctionController",
                                id:
                                  "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2_BuyerAuctionController_receiptLAction",
                                isroot: false,
                                methodName: "receiptLAction",
                                nameSpace: "App\\Http\\Wechat\\V1_0\\Controllers",
                                parentid:
                                  "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2",
                                name: "BuyerAuctionController:receiptLAction"
                              },
                            ]
                          },
                          {
                            className: "SaleCorpAddressCommand",
                            id:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_SaleCorpAddressCommand_handle",
                            isroot: false,
                            methodName: "handle",
                            nameSpace: "App\\Console\\Commands\\Business",
                            parentid:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                            name: "SaleCorpAddressCommand:handle"
                          },
                          {
                            className: "ReceiptTimeEndHandle",
                            id:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_ReceiptTimeEndHandle_receiptOneSale",
                            isroot: false,
                            methodName: "receiptOneSale",
                            nameSpace: "App\\Console\\Commands\\SaleRelated",
                            parentid:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                            name: "ReceiptTimeEndHandle:receiptOneSale",
                            children: [
                              {
                                className: "ReceiptTimeEndHandle",
                                id:
                                  "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_ReceiptTimeEndHandle_receiptOneSale_ReceiptTimeEndHandle_handle",
                                isroot: false,
                                methodName: "handle",
                                nameSpace: "App\\Console\\Commands\\SaleRelated",
                                parentid:
                                  "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_ReceiptTimeEndHandle_receiptOneSale",
                                name: "ReceiptTimeEndHandle:handle"
                              }
                            ]
                          },
                          {
                            className: "BuyerAuctionLogic",
                            id:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2_BuyerAuctionLogic_receiptV2",
                            isroot: false,
                            methodName: "receiptV2",
                            nameSpace: "App\\Logic",
                            parentid:
                              "root_ReceiptService__supplyPrice_ReceiptService__receiptHandle_ReceiptService_orderReceiptDealMoney_ReceiptService_receiptV2",
                            name: "BuyerAuctionLogic:receiptV2"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
            ]
          },
          {
            className: "PayTimeEndCommand",
            id: "root_PayTimeEndCommand__deductDeposit",
            isroot: false,
            methodName: "_deductDeposit",
            nameSpace: "App\\Console\\Commands\\SaleRelated",
            parentid: "root",
            name: "PayTimeEndCommand:_deductDeposit",
            children: [
              {
                className: "PayTimeEndCommand",
                id:
                  "root_PayTimeEndCommand__deductDeposit_PayTimeEndCommand__payTimeEndForOne",
                isroot: false,
                methodName: "_payTimeEndForOne",
                nameSpace: "App\\Console\\Commands\\SaleRelated",
                parentid: "root_PayTimeEndCommand__deductDeposit",
                name: "PayTimeEndCommand:_payTimeEndForOne",
                children: [
                  {
                    className: "PayTimeEndCommand",
                    id:
                      "root_PayTimeEndCommand__deductDeposit_PayTimeEndCommand__payTimeEndForOne_PayTimeEndCommand_handle",
                    isroot: false,
                    methodName: "handle",
                    nameSpace: "App\\Console\\Commands\\SaleRelated",
                    parentid:
                      "root_PayTimeEndCommand__deductDeposit_PayTimeEndCommand__payTimeEndForOne",
                    name: "PayTimeEndCommand:handle"
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  })
}
</script>