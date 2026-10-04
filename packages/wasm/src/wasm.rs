//! The WebAssembly interface. Cards cross it as strings ("AhKd") and results
//! as flat arrays of counts; the JavaScript wrapper (api.js) turns those into
//! objects, which is simpler and faster than building JS objects here.

use wasm_bindgen::prelude::*;

use crate::card::{CardSet, parse_cards};
use crate::{odds, percentages, rank_of};

/// Each hole's wins, then each hole's ties, then the number of boards
#[wasm_bindgen(js_name = oddsCounts)]
pub fn odds_counts(holes: Vec<String>, board: &str) -> Result<Vec<u32>, JsError> {
    let holes = holes
        .iter()
        .map(|hole| parse_cards(hole))
        .collect::<Result<Vec<_>, _>>()?;
    let result = odds(&holes, &parse_cards(board)?)?;
    let wins = result.holes.iter().map(|hole| hole.wins);
    let ties = result.holes.iter().map(|hole| hole.ties);
    Ok(wins.chain(ties).chain([result.boards]).collect())
}

/// The number of boards per hand type (high card first), then the number of boards
#[wasm_bindgen(js_name = percentageCounts)]
pub fn percentage_counts(hole: &str, board: &str, dead: &str) -> Result<Vec<u32>, JsError> {
    let result = percentages(
        &parse_cards(hole)?,
        &parse_cards(board)?,
        &parse_cards(dead)?,
    )?;
    Ok(result.counts.into_iter().chain([result.boards]).collect())
}

/// The rank of the best five-card hand among up to seven cards
#[wasm_bindgen(js_name = handRank)]
pub fn hand_rank(cards: &str) -> Result<u32, JsError> {
    let cards = parse_cards(cards)?;
    if cards.len() > 7 {
        return Err(JsError::new("At most 7 cards can be ranked"));
    }
    Ok(rank_of(CardSet::of(&cards)?))
}
