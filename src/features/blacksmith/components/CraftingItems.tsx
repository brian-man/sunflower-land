import React, { useContext, useState } from "react";

import token from "assets/icons/token.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { Context, InventoryItemName } from "features/game/GameProvider";

import { Button } from "components/ui/Button";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/lib/items";
import { Craftable } from "features/game/events/craft";

interface Props {
  items: Partial<Record<InventoryItemName, Craftable>>;
}

export const CraftingItems: React.FC<Props> = ({ items }) => {
  const [selected, setSelected] = useState<Craftable>(Object.values(items)[0]);

  const { state, dispatcher, shortcutItem } = useContext(Context);
  const inventory = state.inventory;

  const lessIngredients = (amount = 1) => selected.ingredients.some(
    (ingredient) => (inventory[ingredient.item] || 0) < ingredient.amount * amount,
  );
  const lessFunds = (amount = 1) => state.balance < selected.price * amount;

  const craft = (e, amount = 1) => {
    dispatcher({
      type: "item.crafted",
      item: selected.name,
      amount,
    });

    shortcutItem(selected.name);
  };

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(items).map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={item.image}
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/3">
        <div className="flex flex-col justify-center items-center p-2 ">
          <span className="text-base text-shadow text-center">
            {selected.name}
          </span>
          <img
            src={selected.image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-xs text-shadow text-center mt-2">
            {selected.description}
          </span>
          <div className="border-t border-white w-full mt-2 pt-1">
            {selected.ingredients.map((ingredient, index) => {
              const item = ITEM_DETAILS[ingredient.item];
              const hasFunds =
                (inventory[ingredient.item] || 0) >= ingredient.amount;

              return (
                <div className="flex justify-center items-end" key={index}>
                  <img src={item.image} className="h-5 me-2" />
                  <span
                    className={classNames(
                      "text-xs text-shadow text-center mt-2 ",
                      {
                        "text-red-500": !hasFunds,
                      }
                    )}
                  >
                    {ingredient.amount}
                  </span>
                </div>
              );
            })}

            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ", {
                  "text-red-500": lessFunds(),
                })}
              >
                {`$${selected.price}`}
              </span>
            </div>
          </div>
          <Button
            disabled={lessFunds() || lessIngredients()}
            className="text-xs mt-1"
            onClick={craft}
          >
            Craft 1
          </Button>
          <Button
            disabled={lessFunds(10) || lessIngredients(10)}
            className="text-xs mt-1"
            onClick={(e) => craft(e, 10)}
          >
            Craft 10
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
